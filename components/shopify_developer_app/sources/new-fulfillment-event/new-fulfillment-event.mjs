import constants from "../common/constants.mjs";
import common from "../common/webhook-metafields.mjs";

export default {
  ...common,
  key: "shopify_developer_app-new-fulfillment-event",
  name: "New Fulfillment Event (Instant)",
  type: "source",
  description: "Emit new event for each new fulfillment event for a store.",
  version: "0.0.5",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTopic() {
      return constants.EVENT_TOPIC.FULFILLMENT_EVENTS_CREATE;
    },
    generateMeta(resource) {
      const ts = Date.parse(resource.updated_at);
      return {
        id: ts,
        summary: `New Fulfillment Event ${resource.id}.`,
        ts,
      };
    },
  },
};
