import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "elopage",
  propDefinitions: {
    productId: {
      type: "string",
      label: "Product ID",
      description: "The ID of the product",
      async options() {
        const response = await this.listProducts();
        return response?.map((product) => ({
          label: product.name,
          value: product.id,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.myablefy.com/api";
    },
    _makeRequest({
      $ = this, path, params, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        params: {
          ...params,
          key: this.$auth.api_key,
          secret: this.$auth.api_secret,
        },
        ...opts,
      });
    },
    createWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/webhook_endpoints",
        ...opts,
      });
    },
    deleteWebhook({
      webhookId, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/webhook_endpoints/${webhookId}`,
        ...opts,
      });
    },
    listFunnels(opts = {}) {
      return this._makeRequest({
        path: "/funnels",
        ...opts,
      });
    },
    listProducts(opts = {}) {
      return this._makeRequest({
        path: "/products",
        ...opts,
      });
    },
    createOrder(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/orders",
        ...opts,
      });
    },
  },
};
