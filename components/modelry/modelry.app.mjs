import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "modelry",
  propDefinitions: {
    sku: {
      type: "string",
      label: "SKU",
      description: "SKU of the product",
    },
    title: {
      type: "string",
      label: "Title",
      description: "Name or title of the product",
    },
    batchId: {
      type: "string",
      label: "Batch ID",
      description: "Identifier of the product's batch",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of the product",
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Keywords associated with the product",
      optional: true,
    },
    dimensions: {
      type: "string",
      label: "Dimensions",
      description: "Dimensions of the product",
      optional: true,
    },
    externalUrl: {
      type: "string",
      label: "External URL",
      description: "External URL of the product",
      optional: true,
    },
    productId: {
      type: "string",
      label: "Product ID",
      description: "Identifier of the product",
      async options() {
        const response = await this.getProducts();
        const products = response.data;
        return products.map(({
          attributes, id,
        }) => ({
          label: attributes.title,
          value: id,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.modelry.ai/api/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Content-Type": "application/json",
          "Authorization": `${this.$auth.api_token}`,
        },
      });
    },
    async createProduct(args = {}) {
      return this._makeRequest({
        path: "/products",
        method: "post",
        ...args,
      });
    },
    async getProduct({
      productId, args,
    }) {
      return this._makeRequest({
        path: `/products/${productId}/`,
        ...args,
      });
    },
    async deleteProduct({
      productId, args,
    }) {
      return this._makeRequest({
        path: `/products/${productId}/`,
        method: "delete",
        ...args,
      });
    },
    async getProducts(args = {}) {
      return this._makeRequest({
        path: "/products",
        ...args,
      });
    },
  },
};
