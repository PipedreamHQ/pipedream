import constants from "../common/constants.mjs";
import common from "../common/webhook-metafields.mjs";

export default {
  ...common,
  key: "shopify_developer_app-new-paid-order",
  name: "New Paid Order (Instant)",
  type: "source",
  description: "Emit new event each time a new order is paid.",
  version: "0.0.6",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTopic() {
      return constants.EVENT_TOPIC.ORDERS_PAID;
    },
    generateMeta(resource) {
      const ts = Date.parse(resource.updated_at);
      return {
        id: ts,
        summary: `Order Paid ${resource.id}.`,
        ts,
      };
    },
  },
};
