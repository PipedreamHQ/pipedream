import common from "../common/common.mjs";

export default {
  type: "source",
  key: "webflow_v2-new-deleted-collection-item",
  name: "Collection Item Deleted",
  description: "Emit new event when a collection item is deleted. [See the docs here](https://developers.webflow.com/#item-model)",
  version: "0.0.1",
  ...common,
  methods: {
    ...common.methods,
    getWebhookTriggerType() {
      return "collection_item_deleted";
    },
    generateMeta(data) {
      const { id } = data;
      return {
        id,
        summary: `Item deleted: ${id}`,
        ts: Date.now(),
      };
    },
  },
};
