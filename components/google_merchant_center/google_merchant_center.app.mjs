import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "google_merchant_center",
  propDefinitions: {
    productId: {
      type: "string",
      label: "Product ID",
      description: "The ID of the product",
      async options() {
        const products = await this.listProducts();
        return products?.map?.((product) => ({
          label: product.title,
          value: product.id,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://shoppingcontent.googleapis.com/content/v2.1";
    },
    _merchantId() {
      return this.$auth.merchant_id;
    },
    _getHeaders() {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    async _makeRequest({
      $ = this,
      path,
      headers,
      ...otherOpts
    }) {
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          ...this._getHeaders(),
        },
      });
    },
    async listProducts() {
      const { resources } = await this._makeRequest({
        path: `/${this._merchantId()}/products`,
        params: {
          maxResults: 250,
        },
      });
      return resources;
    },
    async updateProduct({
      productId, updateMask, ...args
    }) {
      return this._makeRequest({
        method: "PATCH",
        path: `/${this._merchantId()}/products/${productId}`,
        params: {
          updateMask,
        },
        ...args,
      });
    },
    async createProduct(args) {
      return this._makeRequest({
        method: "POST",
        path: `/${this._merchantId()}/products`,
        headers: {
          "Content-Type": "application/json",
        },
        ...args,
      });
    },
  },
};
