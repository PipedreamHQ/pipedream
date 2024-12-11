import common from "../common/common.mjs";

export default {
  type: "source",
  key: "webflow-new-collection-item",
  name: "New Collection Item Created",
  description: "Emit new event when a collection item is created. [See the documentation](https://developers.webflow.com/data/reference/webhooks/events/collection-item-created)",
  version: "2.0.0",
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
