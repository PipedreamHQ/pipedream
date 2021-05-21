const common = require('../common');

module.exports = {
  ...common,
  key: 'webflow-deleted-collection-item',
  name: 'Deleted Collection Item (Instant)',
  description: 'Emit an event when a collection item is deleted',
  version: '0.0.1',
  dedupe: 'unique',
  methods: {
    ...common.methods,
    getWebhookTriggerType() {
      return 'collection_item_deleted';
    },
    generateMeta(data) {
      const {itemId: id} = data;
      const summary = `Collection item deleted: ID ${id}`;
      const ts = Date.now();
      return {
        id,
        summary,
        ts,
      };
    },
  },
};
