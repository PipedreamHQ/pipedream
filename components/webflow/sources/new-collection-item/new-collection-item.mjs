import common from "../collection-common.mjs";

export default {
  type: "source",
  key: "webflow-new-collection-item",
  name: "New Collection Item",
  description: "Emit new event when a collection item is created. [See the docs here](https://developers.webflow.com/#item-model)",
  version: "0.1.1",
  ...common,
  methods: {
    ...common.methods,
    getWebhookTriggerType() {
      return "collection_item_created";
    },
    generateMeta(data) {
      return {
        id: data._id,
        summary: `New collection item ${data.slug} created`,
        ts: Date.parse(data.createdOn),
      };
    },
  },
};
