import common from "../common/webhook-metafields.mjs";

export default {
  ...common,
  key: "shopify_developer_app-new-product-created",
  name: "New Product Created (Instant)",
  type: "source",
  description: "Emit new event for each product added to a store.",
  version: "0.0.15",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTopic() {
      return "PRODUCTS_CREATE";
    },
    generateMeta(resource) {
      const ts = Date.parse(resource.created_at);
      return {
        id: resource.id,
        summary: `New Product ${resource.id}`,
        ts,
      };
    },
  },
};
