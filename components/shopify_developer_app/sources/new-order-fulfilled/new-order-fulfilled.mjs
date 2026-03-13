import common from "../common/webhook-metafields.mjs";

export default {
  ...common,
  key: "shopify_developer_app-new-order-fulfilled",
  name: "New Order Fulfilled (Instant)",
  type: "source",
  description: "Emit new event whenever an order is fulfilled.",
  version: "0.0.12",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTopic() {
      return "ORDERS_FULFILLED";
    },
    generateMeta(resource) {
      const ts = Date.parse(resource.updated_at);
      return {
        id: ts,
        summary: `New Fulfilled Order ${resource.id}`,
        ts,
      };
    },
  },
};
