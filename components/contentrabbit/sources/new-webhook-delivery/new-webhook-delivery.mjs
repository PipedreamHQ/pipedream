import contentRabbitApp from "../../contentrabbit.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "contentrabbit-new-webhook-delivery",
  name: "New Webhook Delivery",
  description: "Emit new event when Content Rabbit delivers a webhook to your endpoint. [See the documentation](https://contentrabbitai.com/docs/api)",
  version: "0.0.1",
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
      description: "Optional: limit deliveries to a specific subscription. Leave blank for all.",
      optional: true,
    },
    status: {
      type: "string",
      label: "Delivery Status",
      description: "Filter by delivery status.",
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
      const response = await this.contentRabbitApp.listWebhookDeliveries({
        params: {
          subscriptionId: this.subscriptionId,
          status: this.status,
          start,
          end: new Date().toISOString(),
          limit,
        },
      });

      const deliveries = response.data?.items ?? [];
      // The API returns at most `limit` deliveries (newest first) with no cursor
      // to page further. If the response is full, older deliveries in this window
      // may exist beyond it — don't advance the checkpoint past what we've
      // actually seen, so the next poll re-fetches and catches them instead of
      // skipping them forever.
      const truncated = deliveries.length >= limit;

      for (const delivery of deliveries) {
        const ts = Date.parse(delivery.occurredAt);
        if (ts >= savedTs || isDeploy) {
          this.$emit(delivery, this.generateMeta(delivery));
        }
        if (!truncated && ts > maxTs) {
          maxTs = ts;
        }
      }

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
