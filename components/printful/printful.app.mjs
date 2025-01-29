import { axios } from "@pipedream/platform";
import { LIMIT } from "./common/constants.mjs";

export default {
  type: "app",
  app: "printful",
  propDefinitions: {
    storeId: {
      type: "string",
      label: "Store Id",
      description: "The store id to use for the request",
      async options({ page }) {
        const { result } = await this.listStores({
          params: {
            offset: LIMIT * page,
            limit: LIMIT,
          },
        });

        return result.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    productId: {
      type: "string",
      label: "Product Id",
      description: "Sync Product ID (integer) or External ID (if prefixed with @)",
      async options({
        storeId, page,
      }) {
        const { result } = await this.listProducts({
          headers: {
            "X-PF-Store-Id": storeId,
          },
          params: {
            offset: LIMIT * page,
            limit: LIMIT,
          },
        });

        return result.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.printful.com";
    },
    _headers(headers = {}) {
      return {
        ...headers,
        authorization: `Bearer ${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this, path, headers, ...opts
    }) {
      const config = {
        url: this._baseUrl() + path,
        headers: this._headers(headers),
        ...opts,
      };
      console.log("config: ", config);
      return axios($, config);
    },
    createOrder(opts = {}) {
      return this._makeRequest({
        path: "/orders",
        method: "post",
        ...opts,
      });
    },
    listStores(opts = {}) {
      return this._makeRequest({
        path: "/stores",
        ...opts,
      });
    },
    listProducts(opts = {}) {
      return this._makeRequest({
        path: "/store/products",
        ...opts,
      });
    },
    fetchShippingRates(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/shipping/rates",
        ...opts,
      });
    },
    updateProduct({
      productId, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/store/products/${productId}`,
        ...opts,
      });
    },
    createWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/webhooks",
        ...opts,
      });
    },
    deleteWebhook(opts = {}) {
      return this._makeRequest({
        method: "DELETE",
        path: "/webhooks",
        ...opts,
      });
    },
  },
};
