import common from "../common/common.mjs";

export default {
  type: "source",
  key: "webflow-new-deleted-collection-item",
  name: "New Deleted Collection Item",
  description: "Emit new event when a collection item is deleted. [See the docs here](https://developers.webflow.com/#item-model)",
  version: "0.2.1",
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
        ts: Date.parse(data["created-on"]),
      };
    },
  },
};
