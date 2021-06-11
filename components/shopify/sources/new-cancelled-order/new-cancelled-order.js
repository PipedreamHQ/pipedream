const shopify = require("../../shopify.app.js");

module.exports = {
  key: "shopify-new-cancelled-order",
  name: "New Cancelled Order",
  description: "Emits an event each time a new order is cancelled.",
  version: "0.0.3",
  dedupe: "unique",
  props: {
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
    shopify,
  },
  methods: {
    _getLastUpdatedDate() {
      return this.db.get("last_updated_at") || null;
    },
    _setLastUpdatedDate(date) {
      this.db.set("last_updated_at", date);
    },
  },
  async run() {
    const lastUpdatedAt = this._getLastUpdatedDate();
    let results = await this.shopify.getOrders(
      "any",
      true,
      null,
      lastUpdatedAt,
      "cancelled",
    );

    for (const order of results) {
      this.$emit(order, {
        id: order.id,
        summary: `Order cancelled: ${order.name}`,
        ts: Date.parse(order.updated_at),
      });
    }

    if (results[results.length - 1]) {
      this._setLastUpdatedDate(results[results.length - 1].updated_at);
    }
  },
};
