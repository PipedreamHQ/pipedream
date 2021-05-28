const common = require("./common");

module.exports = {
  ...common,
  dedupe: "unique",
  props: {
    ...common.props,
    collectionIds: {
      type: "string[]",
      label: "Collections",
      description: "The collections to monitor for item changes",
      optional: true,
      async options(context) {
        const { page } = context;
        if (page !== 0) {
          return {
            options: [],
          };
        }

        const collections = await this.webflow.listCollections(this.siteId);
        const options = collections.map(collection => ({
          label: collection.name,
          value: collection._id,
        }));
        return {
          options,
        };
      },
    },
  },
  methods: {
    ...common.methods,
    isEventRelevant(event) {
      const { body: { _cid: collectionId } } = event;
      return this.collectionIds.includes(collectionId);
    },
  },
};
