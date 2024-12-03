import common from "../common/common.mjs";

export default {
  type: "source",
  key: "webflow-new-collection-item",
  name: "New Collection Item Created",
  description: "Emit new event when a collection item is created. [See the docs here](https://developers.webflow.com/#item-model)",
  version: "1.0.0",
  ...common,
  methods: {
    ...common.methods,
    getWebhookTriggerType() {
      return "collection_item_created";
    },
    generateMeta(data) {
      const {
        id, fieldData,
      } = data;
      return {
        id,
        summary: `New item: ${fieldData?.slug ?? fieldData?.name ?? id}`,
        ts: Date.parse(data["createdOn"]),
      };
    },
  },
};
