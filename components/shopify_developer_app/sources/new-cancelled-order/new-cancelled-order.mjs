import common from "../common/webhook-metafields.mjs";

export default {
  ...common,
  key: "shopify_developer_app-new-cancelled-order",
  name: "New Cancelled Order (Instant)",
  type: "source",
  description: "Emit new event each time a new order is cancelled.",
  version: "0.0.9",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTopic() {
      return "ORDERS_CANCELLED";
    },
    generateMeta(resource) {
      const ts = Date.parse(resource.updatedAt);
      return {
        id: ts,
        summary: `Order Cancelled ${resource.id}`,
        ts,
      };
    },
  },
};
