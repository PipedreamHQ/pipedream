const common = require("../collection-common");

module.exports = {
  ...common,
  key: "webflow-new-collection-item",
  name: "New Collection Item (Instant)",
  description: "Emit an event when a collection item is created",
  version: "0.0.1",
  methods: {
    ...common.methods,
    getWebhookTriggerType() {
      return "collection_item_created";
    },
    generateMeta(data) {
      const {
        _id: id,
        "created-on": createdOn,
        slug,
      } = data;
      const summary = `Collection item created: ${slug}`;
      const ts = Date.parse(createdOn);
      return {
        id,
        summary,
        ts,
      };
    },
  },
};
