import common from "../common/webhook.mjs";
import constants from "../common/constants.mjs";

export default {
  ...common,
  key: "shopify-fulfillment-request-accepted",
  name: "Fulfillment Request Accepted (Instant)",
  type: "source",
  description: "Emit when a fulfillment service accepts a fulfillment request that was sent by a merchant.",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTopic() {
      return constants.EVENT_TOPIC.FULFILLMENT_ORDERS_FULFILLMENT_REQUEST_ACCEPTED;
    },
    generateMeta(resource) {
      return {
        id: resource.fulfillment_order.id,
        summary: `Fulfillment request accepted for fulfillment order ${resource.fulfillment_order.id}`,
        ts: Date.now(),
      };
    },
  },
};