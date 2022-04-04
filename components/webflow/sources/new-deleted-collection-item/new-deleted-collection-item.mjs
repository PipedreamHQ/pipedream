import common from "../common.mjs";

export default {
  type: "source",
  key: "webflow-new-deleted-collection-item",
  name: "New Deleted Collection Item",
  description: "Emit new event when a collection item is deleted",
  version: "0.1.1",
  ...common,
  methods: {
    ...common.methods,
    getWebhookTriggerType() {
      return "collection_item_deleted";
    },
    generateMeta(data) {
      return {
        id: data.itemId,
        summary: `Collection item ${data.itemId} deleted.`,
        ts: Date.now(),
      };
    },
  },
};
