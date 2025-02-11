import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "printful-new-product-added-instant",
  name: "New Product Added (Instant)",
  description: "Emit new event when a new product is added to your Printful store catalog.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return [
        "product_synced",
      ];
    },
    getModelField() {
      return "sync_product";
    },
    getSummary(body) {
      return `New product added: ${body.data.sync_product.name}`;
    },
  },
  sampleEmit,
};
