import common from "../common/webhook.mjs";
import constants from "../common/constants.mjs";

export default {
  ...common,
  key: "shopify-new-order-created",
  name: "New Order Created (Instant)",
  type: "source",
  description: "Emit new event for each new order submitted to a store.",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTopic() {
      return constants.EVENT_TOPIC.ORDERS_CREATE;
    },
    generateMeta(resource) {
      const ts = Date.parse(resource.created_at);
      return {
        id: resource.id,
        summary: `New Order ${resource.id}.`,
        ts,
      };
    },
  },
};
