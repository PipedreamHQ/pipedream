import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "google_shopping",
  propDefinitions: {
    merchantId: {
      type: "string",
      label: "Merchant ID",
      description: "The Merchant ID associated with your Google Shopping account.",
    },
    productId: {
      type: "string",
      label: "Product ID",
      description: "The Product ID of the item to update.",
      async options({ prevContext, merchantId }) {
        const pageToken = prevContext.nextPageToken || "";
        const { nextPageToken, resources } = await this.listProducts({
          merchantId,
          pageToken,
        });
        return {
          options: resources.map((product) => ({
            label: product.title,
            value: product.id,
          })),
          context: {
            nextPageToken,
          },
        };
      },
    },
    product: {
      type: "object",
      label: "Product",
      description: "The product information to be updated.",
      async options({ productId, merchantId }) {
        if (!productId) return [];
        const product = await this.getProduct({
          merchantId,
          productId,
        });
        return Object.keys(product).map((key) => ({
          label: key,
          value: product[key],
        }));
      },
    },
    updateMask: {
      type: "string[]",
      label: "Update Mask",
      description: "The comma-separated list of product attributes to be updated.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://shoppingcontent.googleapis.com/content/v2.1";
    },
    async _makeRequest(opts = {}) {
      const { $ = this, method = "GET", path, headers, params, data, ...otherOpts } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
        params,
        data,
      });
    },
    async listProducts({ merchantId, pageToken = "" }) {
      return this._makeRequest({
        path: `/${merchantId}/products`,
        params: {
          pageToken,
        },
      });
    },
    async getProduct({ merchantId, productId }) {
      return this._makeRequest({
        path: `/${merchantId}/products/${productId}`,
      });
    },
    async updateProduct({ merchantId, productId, product, updateMask }) {
      return this._makeRequest({
        method: "PUT",
        path: `/${merchantId}/products/${productId}`,
        headers: {
          "Content-Type": "application/json",
        },
        params: { updateMask: updateMask.join(",") },
        data: product,
      });
    },
  },
};