import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "google_merchant_center",
  propDefinitions: {
    merchantId: {
      type: "string",
      label: "Merchant ID",
      description: "The ID of the merchant",
    },
    productId: {
      type: "string",
      label: "Product ID",
      description: "The ID of the product",
      async options({ merchantId }) {
        const products = await this.listProducts({
          merchantId,
        });
        return products.resources.map((product) => ({
          label: product.title,
          value: product.id,
        }));
      },
    },
    product: {
      type: "object",
      label: "Product",
      description: "The product data to update",
      async options({
        productId, merchantId,
      }) {
        const product = await this.getProduct({
          productId,
          merchantId,
        });
        return product;
      },
    },
    updatemask: {
      type: "string",
      label: "Update Mask",
      description: "The comma-separated list of product attributes to be updated.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://shoppingcontent.googleapis.com/content/v2.1";
    },
    async _makeRequest({
      $ = this,
      path,
      headers,
      ...otherOpts
    } = {}) {
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async listProducts({ merchantId }) {
      return this._makeRequest({
        path: `/${merchantId}/products`,
      });
    },
    async getProduct({
      productId, merchantId,
    }) {
      return this._makeRequest({
        path: `/${merchantId}/products/${productId}`,
      });
    },
    async updateProduct({
      merchantId, productId, product, updatemask,
    }) {
      return this._makeRequest({
        method: "PATCH",
        path: `/${merchantId}/products/${productId}`,
        params: {
          updateMask: updatemask,
        },
        data: product,
      });
    },
    async createProduct({
      merchantId, product,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/${merchantId}/products`,
        data: product,
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
  },
};
