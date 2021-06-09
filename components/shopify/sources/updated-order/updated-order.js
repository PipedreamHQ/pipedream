const shopify = require("../../shopify.app.js");

module.exports = {
  key: "shopify-updated-order",
  name: "Updated Order",
  description: "Emits an event each time an order is updated.",
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
    );

    for (const order of results) {
      const id = `${order.id}-${order.updated_at}`;
      this.$emit(order, {
        id,
        summary: `Order updated: ${order.name}`,
        ts: Date.parse(order.updated_at),
      });
    }

    if (results[results.length - 1]) {
      this._setLastUpdatedDate(results[results.length - 1].updated_at);
    }
  },
};
