const common = require("../collection-common");

module.exports = {
  ...common,
  key: "webflow-changed-collection-item",
  name: "Changed Collection Item (Instant)",
  description: "Emit an event when a collection item is changed",
  version: "0.0.1",
  methods: {
    ...common.methods,
    getWebhookTriggerType() {
      return "collection_item_changed";
    },
    generateMeta(data) {
      const {
        _id: itemId,
        slug,
        "updated-on": updatedOn,
      } = data;
      const summary = `Collection item changed: ${slug}`;
      const ts = Date.parse(updatedOn);
      const id = `${itemId}-${ts}`;
      return {
        id,
        summary,
        ts,
      };
    },
  },
};
