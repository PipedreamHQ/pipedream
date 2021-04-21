const shopify = require("../../shopify.app.js");

module.exports = {
  key: "shopify-updated-order",
  name: "Updated Order",
  description: "Emits an event each time an order is updated.",
  version: "0.0.1",
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
  async run() {
    const lastUpdatedAt = this.db.get("last_updated_at") || null;
    let results = await this.shopify.getOrders(
      "any",
      true,
      null,
      lastUpdatedAt
    );

    for (const order of results) {
      const dedupeId = `${order.id}-${order.updated_at}`;
      this.$emit(order, {
        id: dedupeId,
        summary: `Order ${order.name}`,
        ts: Date.now(),
      });
    }

    if (results[results.length - 1])
      this.db.set("last_updated_id", results[results.length - 1].updated_at);
  },
};
