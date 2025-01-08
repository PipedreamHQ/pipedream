import constants from "../common/constants.mjs";
import common from "../common/webhook-metafields.mjs";

export default {
  ...common,
  key: "shopify_developer_app-new-order-fulfilled",
  name: "New Order Fulfilled (Instant)",
  type: "source",
  description: "Emit new event whenever an order is fulfilled.",
  version: "0.0.3",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTopic() {
      return constants.EVENT_TOPIC.ORDERS_FULFILLED;
    },
    generateMeta(resource) {
      const ts = Date.parse(resource.updated_at);
      return {
        id: ts,
        summary: `New Fulfilled Order ${resource.id}.`,
        ts,
      };
    },
  },
};
