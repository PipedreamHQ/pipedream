import common from "../common/collection-common.mjs";

export default {
  type: "source",
  key: "webflow-changed-collection-item",
  name: "New Changed Collection Item",
  description: "Emit new event when a collection item is changed. [See the docs here](https://developers.webflow.com/#model16)",
  version: "0.2.0",
  ...common,
  methods: {
    ...common.methods,
    getWebhookTriggerType() {
      return "collection_item_changed";
    },
    generateMeta(data) {
      const ts = Date.parse(data["updated-on"]);

      return {
        id: `${data._id}-${ts}`,
        summary: `Collection ${data.slug} item changed`,
        ts,
      };
    },
  },
};
