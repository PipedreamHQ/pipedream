import common from "../common/common.mjs";

export default {
  ...common,
  key: "hubspot-product-updated",
  name: "Product Updated",
  description: "Emit new event each time a product is updated.",
  version: "0.0.13",
  dedupe: "unique",
  type: "source",
  hooks: {},
  methods: {
    ...common.methods,
    getTs(product) {
      return Date.parse(product.updatedAt);
    },
    generateMeta(product) {
      const {
        id,
        properties,
      } = product;
      const ts = this.getTs(product);
      return {
        id: `${id}${ts}`,
        summary: properties.name,
        ts,
      };
    },
    isRelevant(product, updatedAfter) {
      return this.getTs(product) > updatedAfter;
    },
    getParams() {
      return {
        limit: 100,
        sorts: [
          {
            propertyName: "hs_lastmodifieddate",
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
