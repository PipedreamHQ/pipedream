import common from "../common/common.mjs";

export default {
  type: "source",
  key: "webflow-changed-collection-item",
  name: "Collection Item Updated",
  description: "Emit new event when a collection item is changed. [See the documentation](https://developers.webflow.com/data/reference/webhooks/events/collection-item-changed)",
  version: "2.0.0",
  ...common,
  methods: {
    ...common.methods,
    getWebhookTriggerType() {
      return "collection_item_changed";
    },
    generateMeta(data) {
      const {
        id, fieldData, lastUpdated,
      } = data;
      const ts = Date.parse(lastUpdated);

      return {
        id: `${id}-${ts}`,
        summary: `Item updated: ${fieldData?.slug ?? fieldData?.name ?? id}`,
        ts,
      };
    },
  },
};
