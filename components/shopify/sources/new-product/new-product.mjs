import shopify from "../../shopify.app.mjs";

export default {
  key: "shopify-new-product",
  name: "New Product",
  type: "source",
  description: "Emit new event for each product added to a store.",
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
    let results = await this.shopify.getProducts(sinceId);

    for (const product of results) {
      this.$emit(product, {
        id: product.id,
        summary: product.title,
        ts: Date.now(),
      });
    }

    if (results[results.length - 1])
      this.db.set("since_id", results[results.length - 1].id);
  },
};
