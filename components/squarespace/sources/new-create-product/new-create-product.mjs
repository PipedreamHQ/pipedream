import squarespace from "../../squarespace.app.mjs";

export default {
  name: "New Create Product",
  version: "0.0.1",
  key: "squarespace-new-create-product",
  description: "Emit new event for each product created.",
  type: "source",
  dedupe: "unique",
  props: {
    squarespace,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 5,
      },
    },
  },
  async run() {
    const products = await this.squarespace.getProducts();

    for (const product of products) {
      this.$emit(product, {
        id: product.id,
        summary: `New product ${product.id} created`,
        ts: Date.parse(product.createdOn),
      });
    }
  },
};
