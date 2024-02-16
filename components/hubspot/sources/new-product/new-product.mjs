import common from "../common/common.mjs";

export default {
  ...common,
  key: "hubspot-new-product",
  name: "New Products",
  description: "Emit new event for each new product created.",
  version: "0.0.12",
  dedupe: "unique",
  type: "source",
  hooks: {},
  methods: {
    ...common.methods,
    getTs(product) {
      return Date.parse(product.createdAt);
    },
    generateMeta(product) {
      const {
        id,
        properties,
      } = product;
      const ts = this.getTs(product);
      return {
        id,
        summary: properties.name,
        ts,
      };
    },
    isRelevant(product, createdAfter) {
      return this.getTs(product) > createdAfter;
    },
    getParams() {
      return {
        limit: 100,
        sorts: [
          {
            propertyName: "createdate",
            direction: "DESCENDING",
          },
        ],
        object: "products",
      };
    },
    async processResults(after, params) {
      await this.searchCRM(params, after);
    },
  },
};
