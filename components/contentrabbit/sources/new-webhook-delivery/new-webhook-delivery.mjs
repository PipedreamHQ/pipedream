import contentRabbitApp from "../../contentrabbit.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

// A backstop only. The cursor walk terminates on its own once a page comes
// back without a next cursor; this stops a server that always returns one from
// pinning the worker.
const MAX_PAGES = 50;

export default {
  key: "contentrabbit-new-webhook-delivery",
  name: "New Webhook Delivery",
  description: "Emit new event when Content Rabbit delivers a webhook to your endpoint. Polls the delivery log, so an event appears within one polling interval rather than instantly. [See the documentation](https://contentrabbitai.com/docs/api)",
  version: "0.0.8",
  type: "source",
  dedupe: "unique",
  props: {
    contentRabbitApp,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    subscriptionId: {
      type: "string",
      label: "Webhook Subscription ID",
      description: "Limit deliveries to one webhook subscription. The list is your team's own subscriptions, from `GET /webhooks`; each option is labelled with the endpoint it delivers to. Leave blank to emit deliveries for every subscription.",
      optional: true,
      async options() {
        const { data } = await this.contentRabbitApp.listWebhooks({
          params: {
            limit: 100,
          },
        });
        return (data ?? []).map((subscription) => {
          // Show only the host, not the full target URL: some webhook
          // providers (e.g. Slack/Discord incoming webhooks) embed a bearer
          // token in the URL path, and this label is visible to anyone with
          // view access to the workflow.
          let host = subscription.id;
          try {
            host = new URL(subscription.targetUrl).host;
          } catch {
            // Fall through to the subscription id.
          }
          return {
            label: `${host} (${subscription.id})`,
            value: subscription.id,
          };
        });
      },
    },
    status: {
      type: "string",
      label: "Delivery Status",
      description: "Emit only deliveries in this state. Leave blank for all four. A delivery moves `queued` -> `delivering` -> `success` or `failed`, so filtering on `success` alone drops the retries.",
      options: [
        "queued",
        "delivering",
        "success",
        "failed",
      ],
      optional: true,
    },
  },
  hooks: {
    async deploy() {
      await this.processEvent(25, true);
    },
  },
  methods: {
    _getSavedTs() {
      return this.db.get("savedTs") ?? 0;
    },
    _setSavedTs(ts) {
      this.db.set("savedTs", ts);
    },
    generateMeta(delivery) {
      return {
        id: delivery.id,
        summary: `Delivery ${delivery.id} - ${delivery.eventType} (${delivery.status})`,
        ts: Date.parse(delivery.occurredAt),
      };
    },
    /**
     * Collect every delivery in `[start, now]`, newest first.
     *
     * The endpoint pages with a `(createdAt, id)` keyset cursor, so this is a
     * plain walk: follow `nextCursor` until it comes back null. An earlier
     * version had to narrow `end` toward the oldest row it had seen, because
     * the endpoint offered no cursor at all. That could not terminate when a
     * whole page shared one timestamp -- pulling `end` back reached the same
     * rows forever -- and calling such a window drained skipped the rest of the
     * tie. The id in the cursor is what removes the ambiguity.
     */
    async collectWindow({
      start, limit, initialCursor,
    }) {
      const deliveries = [];
      let cursor = initialCursor;

      for (let page = 0; page < MAX_PAGES; page++) {
        const response = await this.contentRabbitApp.listWebhookDeliveries({
          params: {
            subscriptionId: this.subscriptionId,
            status: this.status,
            start,
            end: new Date().toISOString(),
            limit,
            cursor,
          },
        });

        const items = response.data?.items ?? [];
        deliveries.push(...items);

        cursor = response.data?.nextCursor ?? null;
        if (!cursor) {
          return {
            deliveries,
            drained: true,
          };
        }
      }

      // Out of page budget with more to read. Keep the cursor so the next tick
      // resumes where this one stopped rather than re-reading from the top.
      return {
        deliveries,
        drained: false,
        cursor,
      };
    },
    async processEvent(max, isDeploy = false) {
      const savedTs = this._getSavedTs();

      // A window still being paged keeps the start it began with. Recomputing
      // it would lose deploy's 15-minute boundary and fall back to an
      // unbounded fetch.
      const pending = this.db.get("pendingWindow") ?? null;

      // Always send an explicit start. The endpoint requires one alongside a
      // cursor, because its default lower bound is "15 minutes ago" recomputed
      // per request -- a window whose floor creeps forward between pages would
      // let a delivery slip under it and be returned by no page at all.
      const defaultStart = isDeploy || savedTs <= 0
        ? new Date(Date.now() - 15 * 60 * 1000).toISOString()
        : new Date(savedTs).toISOString();

      // A pending window persisted by the pre-cursor version of this source
      // stored `start: null` whenever it began undrained with no saved
      // timestamp -- i.e. an unbounded, full-history drain that hadn't
      // finished. Resuming that with `defaultStart` (15 minutes ago, since
      // savedTs is still unset in that state) would silently drop everything
      // between the epoch and 15 minutes ago that the old walk hadn't reached
      // yet. Fall back to the epoch instead, which preserves the original
      // "no lower bound" intent.
      const start = pending
        ? (pending.start ?? new Date(0).toISOString())
        : defaultStart;

      const limit = max ?? 200;
      const {
        deliveries: collected, drained, cursor,
      } = await this.collectWindow({
        start,
        limit,
        initialCursor: pending?.cursor,
      });

      // Deploy's `max` caps emitted events, not just the page size.
      const deliveries = isDeploy
        ? collected.slice(0, limit)
        : collected;

      // The high-water mark spans the whole window, however many ticks it
      // takes to page, so it carries over from the pending state.
      let highTs = pending?.highTs ?? savedTs;

      for (const delivery of deliveries) {
        const ts = Date.parse(delivery.occurredAt);
        if (ts >= savedTs || isDeploy) {
          this.$emit(delivery, this.generateMeta(delivery));
        }
        if (Number.isFinite(ts) && ts > highTs) {
          highTs = ts;
        }
      }

      if (!drained) {
        this.db.set("pendingWindow", {
          start,
          highTs,
          cursor,
        });
        return;
      }

      this.db.set("pendingWindow", null);

      // If deploy found nothing in the lookback window, bookmark "now" so the
      // next poll doesn't fall back to an unbounded, full-history fetch.
      this._setSavedTs(isDeploy && deliveries.length === 0
        ? Date.now()
        : highTs);
    },
  },
  async run() {
    await this.processEvent();
  },
};
