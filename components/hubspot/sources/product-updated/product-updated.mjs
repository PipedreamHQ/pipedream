import common from "../common.mjs";

export default {
  ...common,
  key: "hubspot-product-updated",
  name: "Product Updated",
  description: "Emit new event each time a product is updated.",
  version: "0.0.3",
  dedupe: "unique",
  type: "source",
  hooks: {},
  methods: {
    ...common.methods,
    generateMeta(product) {
      const {
        id,
        properties,
        updatedAt,
      } = product;
      const ts = Date.parse(updatedAt);
      return {
        id: `${id}${ts}`,
        summary: properties.name,
        ts,
      };
    },
    isRelevant(product, updatedAfter) {
      return Date.parse(product.updatedAt) > updatedAfter;
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
