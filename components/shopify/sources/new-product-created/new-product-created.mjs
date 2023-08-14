import common from "../common/webhook.mjs";
import constants from "../common/constants.mjs";

export default {
  ...common,
  key: "shopify-new-product-created",
  name: "New Product Created (Instant)",
  type: "source",
  description: "Emit new event for each product added to a store.",
  version: "0.0.8",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTopic() {
      return constants.EVENT_TOPIC.PRODUCTS_CREATE;
    },
    generateMeta(resource) {
      const ts = Date.parse(resource.created_at);
      return {
        id: resource.id,
        summary: `New Product ${resource.id}.`,
        ts,
      };
    },
  },
};
