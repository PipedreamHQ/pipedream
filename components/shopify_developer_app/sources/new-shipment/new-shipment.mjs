import common from "../common/webhook.mjs";
import constants from "../common/constants.mjs";

export default {
  ...common,
  key: "shopify_developer_app-new-shipment",
  name: "New Shipment (Instant)",
  type: "source",
  description: "Emit new event for each new fulfillment event for a store.",
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
        summary: `New Shipped Order ${resource.id}.`,
        ts,
      };
    },
  },
};
