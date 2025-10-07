import common from "../common/webhook.mjs";

export default {
  ...common,
  key: "shopify_developer_app-inventory-level-updated",
  name: "Inventory Level Updated (Instant)",
  description: "Emit new event when an inventory level is updated.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTopic() {
      return "INVENTORY_LEVELS_UPDATE";
    },
    generateMeta(resource) {
      const ts = Date.parse(resource.updated_at);
      return {
        id: `${resource.inventory_item_id}-${ts}`,
        summary: `Inventory Level Updated ${resource.inventory_item_id}`,
        ts,
      };
    },
  },
};
