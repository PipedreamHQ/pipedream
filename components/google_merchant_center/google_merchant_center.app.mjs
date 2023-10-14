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
        return products.resources.map((product) => ({
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
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async listProducts() {
      return this._makeRequest({
        path: `/${this._merchantId()}/products`,
      });
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
