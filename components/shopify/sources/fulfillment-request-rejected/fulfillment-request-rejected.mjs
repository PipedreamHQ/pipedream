import common from "../common/webhook.mjs";
import constants from "../common/constants.mjs";

export default {
  ...common,
  key: "shopify-fulfillment-request-rejected",
  name: "Fulfillment Request Rejected (Instant)",
  type: "source",
  description: "Emit when a fulfillment service rejects a fulfillment request that was sent by a merchant.",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTopic() {
      return constants.EVENT_TOPIC.FULFILLMENT_ORDERS_FULFILLMENT_REQUEST_REJECTED;
    },
    generateMeta(resource) {
      return {
        id: resource.fulfillment_order.id,
        summary: `Fulfillment request rejected for fulfillment order ${resource.fulfillment_order.id}`,
        ts: Date.now(),
      };
    },
  },
};