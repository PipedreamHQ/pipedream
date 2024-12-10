import constants from "../common/constants.mjs";
import common from "../common/webhook-metafields.mjs";

export default {
  ...common,
  key: "shopify_developer_app-new-fulfillment-event-created",
  name: "New Fulfillment Event Created (Instant)",
  type: "source",
  description: "Emit new event when a fulfillment event is created.",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTopic() {
      return constants.EVENT_TOPIC.FULFILLMENT_EVENTS_CREATE;
    },
    generateMeta(resource) {
      const ts = Date.parse(resource.created_at);
      return {
        id: resource.id,
        summary: `New Fulfillment Event ${resource.id}`,
        ts,
      };
    },
  },
};
