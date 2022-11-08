import shopify from "../../shopify.app.mjs";

export default {
  key: "shopify-new-abandoned-cart",
  name: "New Abandoned Cart",
  type: "source",
  description: "Emit new event each time a user abandons their cart.",
  version: "0.0.6",
  dedupe: "unique",
  props: {
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 15 * 60, // 15 minutes
      },
    },
    shopify,
  },
  async run() {
    const sinceId = this.db.get("since_id") || null;
    const results = await this.shopify.getAbandonedCheckouts(sinceId);
    for (const cart of results) {
      this.$emit(cart, {
        id: cart.id,
        summary: cart.email,
        ts: Date.now(),
      });
    }
    if (results[results.length - 1])
      this.db.set("since_id", results[results.length - 1].id);
  },
};
