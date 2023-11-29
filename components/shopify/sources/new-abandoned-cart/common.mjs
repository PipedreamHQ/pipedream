import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getSinceId() {
      return this.db.get("sinceId") || null;
    },
    _setSinceId(sinceId) {
      this.db.set("sinceId", sinceId);
    },
  },
  async run() {
    const sinceId = this._getSinceId();
    const results = await this.shopify.getAbandonedCheckouts(sinceId);

    for (const cart of results) {
      this.$emit(cart, {
        id: cart.id,
        summary: cart.email,
        ts: Date.now(),
      });
    }

    if (results.length > 0)
      this._setSinceId(results[results.length - 1].id);
  },
};
