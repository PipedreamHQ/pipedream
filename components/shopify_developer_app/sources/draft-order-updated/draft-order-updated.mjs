import common from "../common/webhook.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "shopify_developer_app-draft-order-updated",
  name: "Draft Order Updated (Instant)",
  type: "source",
  description: "Emit new event for each draft order updated in a store.",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTopic() {
      return "DRAFT_ORDERS_UPDATE";
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `Draft order updated ${resource.id}`,
        ts: Date.parse(resource.created_at),
      };
    },
  },
  sampleEmit,
};
