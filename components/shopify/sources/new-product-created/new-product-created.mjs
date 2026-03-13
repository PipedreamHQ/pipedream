import common from "../common/webhook.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "shopify-new-product-created",
  name: "New Product Created (Instant)",
  type: "source",
  description: "Emit new event for each product added to a store.",
  version: "0.0.17",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTopic() {
      return "PRODUCTS_CREATE";
    },
    generateMeta(resource) {
      const ts = Date.parse(resource.createdAt);
      return {
        id: resource.id,
        summary: `New Product ${resource.title}`,
        ts,
      };
    },
  },
  sampleEmit,
};
