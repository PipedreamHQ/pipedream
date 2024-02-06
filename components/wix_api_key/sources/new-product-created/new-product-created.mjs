import common from "../common/common.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "wix_api_key-new-product-created",
  name: "New Product Created",
  description: "Emit new event when a new product is created. [See the documentation](https://dev.wix.com/api/rest/wix-stores/catalog/products/query-products)",
  version: "0.0.1",
  type: "source",
  methods: {
    ...common.methods,
    getParams() {
      return {
        query: {
          paging: {
            limit: constants.DEFAULT_LIMIT,
            offset: 0,
          },
        },
      };
    },
    async getResources({
      siteId, params,
    }) {
      const { products } = await this.wix.listProducts({
        siteId,
        data: params,
      });
      return products;
    },
    advancePage(params) {
      params.query.paging.offset += constants.DEFAULT_LIMIT;
      return params;
    },
    generateMeta(product) {
      return {
        id: product.id,
        summary: product.name,
        ts: this.getTs(product),
      };
    },
  },
};
