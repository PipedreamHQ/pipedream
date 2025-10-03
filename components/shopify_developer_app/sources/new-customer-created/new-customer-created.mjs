import common from "../common/webhook-metafields.mjs";

export default {
  ...common,
  key: "shopify_developer_app-new-customer-created",
  name: "New Customer Created (Instant)",
  type: "source",
  description: "Emit new event for each new customer added to a store.",
  version: "0.0.14",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTopic() {
      return "CUSTOMERS_CREATE";
    },
    generateMeta(resource) {
      const ts = Date.parse(resource.created_at);
      return {
        id: resource.id,
        summary: `New Customer ${resource.id}`,
        ts,
      };
    },
  },
};
