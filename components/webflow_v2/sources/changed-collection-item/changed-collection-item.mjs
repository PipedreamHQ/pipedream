import common from "../common/common.mjs";

export default {
  type: "source",
  key: "webflow_v2-changed-collection-item",
  name: "Collection Item Updated",
  description: "Emit new event when a collection item is changed. [See the docs here](https://developers.webflow.com/#model16)",
  version: "0.0.1",
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
