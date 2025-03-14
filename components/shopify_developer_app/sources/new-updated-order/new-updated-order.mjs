import common from "../common/webhook-metafields.mjs";

export default {
  ...common,
  key: "shopify_developer_app-new-updated-order",
  name: "New Updated Order (Instant)",
  type: "source",
  description: "Emit new event each time an order is updated.",
  version: "0.0.9",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTopic() {
      return "ORDERS_UPDATED";
    },
    generateMeta(resource) {
      const ts = Date.parse(resource.updatedAt);
      return {
        id: ts,
        summary: `Order Updated ${resource.id}`,
        ts,
      };
    },
  },
};
