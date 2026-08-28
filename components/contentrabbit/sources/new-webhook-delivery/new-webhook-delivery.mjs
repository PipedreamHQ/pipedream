import contentRabbitApp from "../../contentrabbit.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

// The deliveries endpoint answers newest-first and offers no cursor, so a busy
// window has to be walked backwards one page at a time. Cap the walk: a source
// that never returns is worse than one that resumes on the next tick.
const MAX_DRAIN_PASSES = 20;

export default {
  key: "contentrabbit-new-webhook-delivery",
  name: "New Webhook Delivery",
  description: "Emit new event when Content Rabbit delivers a webhook to your endpoint. Polls the delivery log, so an event appears within one polling interval rather than instantly. [See the documentation](https://contentrabbitai.com/docs/api)",
  version: "0.0.5",
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
     * Collect every delivery in `[start, initialEnd ?? now]`.
     *
     * The API caps a response at `limit` and sorts newest first, with no cursor
     * to page further. Asking once and stopping is what let deliveries go
     * missing: under sustained volume the page stayed full, the checkpoint
     * could never advance, and anything older than one page sat outside the
     * window forever. So each pass pulls `end` back to the oldest delivery it
     * has already seen and asks again, until a pass returns a short page.
     *
     * A single call still caps out at `MAX_DRAIN_PASSES`. When that happens the
     * caller persists `lastEnd` and passes it back in as `initialEnd` on the
     * next poll, so the walk resumes where it stopped instead of restarting
     * from "now" — since `[start, lastEnd]` only shrinks over time (new
     * deliveries can't retroactively land below `lastEnd`), this always
     * converges even under sustained volume.
     */
    async drainWindow({
      start, limit, initialEnd,
    }) {
      const collected = [];
      const seen = new Set();
      let end = initialEnd || new Date().toISOString();

      for (let pass = 0; pass < MAX_DRAIN_PASSES; pass++) {
        const response = await this.contentRabbitApp.listWebhookDeliveries({
          params: {
            subscriptionId: this.subscriptionId,
            status: this.status,
            start,
            end,
            limit,
          },
        });

        const items = response.data?.items ?? [];
        let oldestTs = null;
        for (const item of items) {
          if (!seen.has(item.id)) {
            seen.add(item.id);
            collected.push(item);
          }
          const ts = Date.parse(item.occurredAt);
          if (Number.isFinite(ts) && (oldestTs === null || ts < oldestTs)) {
            oldestTs = ts;
          }
        }

        if (items.length < limit || oldestTs === null) {
          return {
            deliveries: collected,
            drained: true,
          };
        }

        const nextEnd = new Date(oldestTs).toISOString();
        if (nextEnd === end) {
          // A whole page shares one timestamp, so pulling `end` back cannot
          // make progress. Treat the window as drained rather than persisting
          // this same `end` for the next poll to retry: since `initialEnd` is
          // fed straight back into the next call, retrying would re-issue the
          // identical query, hit the identical tie, and never terminate.
          // Anything still unseen at this exact timestamp is missed, same as
          // an ordinary truncated page.
          return {
            deliveries: collected,
            drained: true,
          };
        }
        end = nextEnd;
      }

      return {
        deliveries: collected,
        drained: false,
        lastEnd: end,
      };
    },
    async processEvent(max, isDeploy = false) {
      const savedTs = this._getSavedTs();

      // A window that did not finish draining is resumed exactly as it began.
      // Recomputing `start` here instead would lose deploy's 15-minute
      // boundary and fall back to an unbounded, full-history fetch; and
      // recomputing the high-water mark would bank the older tail's newest
      // timestamp, sending the following poll back over deliveries already
      // emitted.
      const pending = this.db.get("pendingWindow") ?? null;

      const start = pending
        ? (pending.start ?? undefined)
        : isDeploy
          ? new Date(Date.now() - 15 * 60 * 1000).toISOString()
          : savedTs > 0
            ? new Date(savedTs).toISOString()
            : undefined;

      const limit = max ?? 200;
      const {
        deliveries: drainedDeliveries, drained, lastEnd,
      } = await this.drainWindow({
        start,
        limit,
        initialEnd: pending?.end,
      });

      // `drainWindow` walks past a single page to avoid dropping deliveries, so
      // it can collect more than `limit` items across passes. That's the point
      // for polling, but deploy's caller-requested `max` is a cap on emitted
      // events, not just a page size — respect it here.
      const deliveries = isDeploy
        ? drainedDeliveries.slice(0, limit)
        : drainedDeliveries;

      // The high-water mark spans the whole window, across however many polls
      // it takes to drain, so it carries over from the pending state.
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
        // Keep the checkpoint where it is and remember the whole window, so the
        // next poll continues this walk rather than starting a new one.
        this.db.set("pendingWindow", {
          start: start ?? null,
          end: lastEnd,
          highTs,
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
