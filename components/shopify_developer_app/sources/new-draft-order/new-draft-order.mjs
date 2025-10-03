import common from "../common/webhook-metafields.mjs";

export default {
  ...common,
  key: "shopify_developer_app-new-draft-order",
  name: "New Draft Order (Instant)",
  type: "source",
  description: "Emit new event for each new draft order submitted to a store.",
  version: "0.0.14",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTopic() {
      return "DRAFT_ORDERS_CREATE";
    },
    generateMeta(resource) {
      const ts = Date.parse(resource.created_at);
      return {
        id: resource.id,
        summary: `New Draft Order ${resource.id}`,
        ts,
      };
    },
  },
};
