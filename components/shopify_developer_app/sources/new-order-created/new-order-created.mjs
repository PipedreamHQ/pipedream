import common from "../common/webhook-metafields.mjs";

export default {
  ...common,
  key: "shopify_developer_app-new-order-created",
  name: "New Order Created (Instant)",
  type: "source",
  description: "Emit new event for each new order submitted to a store.",
  version: "0.0.14",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTopic() {
      return "ORDERS_CREATE";
    },
    generateMeta(resource) {
      const ts = Date.parse(resource.created_at);
      return {
        id: resource.id,
        summary: `New Order ${resource.id}`,
        ts,
      };
    },
  },
};
