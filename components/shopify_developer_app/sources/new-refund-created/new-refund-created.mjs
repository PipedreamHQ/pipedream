import constants from "../common/constants.mjs";
import common from "../common/webhook.mjs";

export default {
  ...common,
  key: "shopify_developer_app-new-refund-created",
  name: "New Refund Created (Instant)",
  description: "Emit new event when a new refund is created.",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTopic() {
      return constants.EVENT_TOPIC.REFUNDS_CREATE;
    },
    generateMeta(resource) {
      const ts = Date.parse(resource.created_at);
      return {
        id: `${resource.id}-${ts}`,
        summary: `Refund Created ${resource.id}`,
        ts,
      };
    },
  },
};
