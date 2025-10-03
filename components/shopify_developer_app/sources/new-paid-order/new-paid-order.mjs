import common from "../common/webhook-metafields.mjs";

export default {
  ...common,
  key: "shopify_developer_app-new-paid-order",
  name: "New Paid Order (Instant)",
  type: "source",
  description: "Emit new event each time a new order is paid.",
  version: "0.0.14",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTopic() {
      return "ORDERS_PAID";
    },
    generateMeta(resource) {
      const ts = Date.parse(resource.updated_at);
      return {
        id: ts,
        summary: `Order Paid ${resource.id}`,
        ts,
      };
    },
  },
};
