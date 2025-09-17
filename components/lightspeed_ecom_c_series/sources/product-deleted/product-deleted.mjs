import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "indiefunnels-product-deleted",
  name: "Product Deleted (Instant)",
  description: "Emit new event when a product is deleted.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getItemGroup() {
      return "products";
    },
    getItemAction() {
      return "deleted";
    },
    generateMeta(body) {
      return {
        id: body.product.id,
        summary: this.getSummary(`Product with ID ${body.product.id} deleted`),
        ts: Date.parse(body.product.deletedAt),
      };
    },
  },
  sampleEmit,
};
