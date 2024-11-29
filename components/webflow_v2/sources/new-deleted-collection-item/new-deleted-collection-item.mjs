import common from "../common/common.mjs";

export default {
  type: "source",
  key: "webflow_v2-new-deleted-collection-item",
  name: "Collection Item Deleted",
  description: "Emit new event when a collection item is deleted. [See the docs here](https://developers.webflow.com/#item-model)",
  version: "0.0.{{ts}}",
  ...common,
  methods: {
    ...common.methods,
    getWebhookTriggerType() {
      return "collection_item_deleted";
    },
    generateMeta(data) {
      return {
        id: data.itemId,
        summary: `Item ${data.itemId} deleted`,
        ts: Date.parse(data["created-on"]),
      };
    },
  },
};
