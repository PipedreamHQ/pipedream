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
  version: "0.0.4",
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
        return (data ?? []).map((subscription) => ({
          label: subscription.targetUrl || subscription.id,
          value: subscription.id,
        }));
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
          // make progress. Stop and let the next poll retry rather than spin.
          break;
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
      let maxTs = savedTs;

      // For deploy, go back 15 minutes; for polling, use the saved timestamp
      const start = isDeploy
        ? new Date(Date.now() - 15 * 60 * 1000).toISOString()
        : savedTs > 0
          ? new Date(savedTs).toISOString()
          : undefined;

      const limit = max ?? 200;
      const pendingEnd = this.db.get("pendingEnd") ?? undefined;
      const {
        deliveries, drained, lastEnd,
      } = await this.drainWindow({
        start,
        limit,
        initialEnd: pendingEnd,
      });

      for (const delivery of deliveries) {
        const ts = Date.parse(delivery.occurredAt);
        if (ts >= savedTs || isDeploy) {
          this.$emit(delivery, this.generateMeta(delivery));
        }
        // Only bank progress once the window is known to be empty behind us.
        // Advancing after a partial drain is what would skip deliveries.
        if (drained && Number.isFinite(ts) && ts > maxTs) {
          maxTs = ts;
        }
      }

      // Persist where an incomplete drain stopped so the next poll resumes the
      // walk instead of restarting from "now" and re-capping on the same busy
      // window forever.
      this.db.set("pendingEnd", drained
        ? null
        : lastEnd);

      // If deploy found nothing in the lookback window, bookmark "now" so the
      // next poll doesn't fall back to an unbounded, full-history fetch.
      if (isDeploy && deliveries.length === 0) {
        maxTs = Date.now();
      }

      this._setSavedTs(maxTs);
    },
  },
  async run() {
    await this.processEvent();
  },
};
