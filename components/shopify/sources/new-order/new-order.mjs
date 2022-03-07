import shopify from "../../shopify.app.mjs";

export default {
  key: "shopify-new-order",
  name: "New Order",
  type: "source",
  description: "Emit new event for each new order submitted to a store.",
  version: "0.0.5",
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
    const sinceId = this.db.get("since_id") || null;
    let results = await this.shopify.getOrders("any", true, sinceId);

    for (const order of results) {
      this.$emit(order, {
        id: order.id,
        summary: `Order ${order.name}`,
        ts: Date.now(),
      });
    }

    if (results[results.length - 1])
      this.db.set("since_id", results[results.length - 1].id);
  },
};
