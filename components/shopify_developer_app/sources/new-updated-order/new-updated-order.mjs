import common from "../common/webhook.mjs";
import constants from "../common/constants.mjs";

export default {
  ...common,
  key: "shopify_developer_app-new-updated-order",
  name: "New Updated Order (Instant)",
  type: "source",
  description: "Emit new event each time an order is updated.",
  version: "0.0.3",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTopic() {
      return constants.EVENT_TOPIC.ORDERS_UPDATED;
    },
    generateMeta(resource) {
      const ts = Date.parse(resource.updated_at);
      return {
        id: ts,
        summary: `Order Updated ${resource.id}.`,
        ts,
      };
    },
  },
};
