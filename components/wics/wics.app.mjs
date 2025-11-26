import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "wics",
  propDefinitions: {
    api_key: {
      type: "string",
      secret: true,
      label: "API Key",
      description: "WICS API Key",
    },
    base_url: {
      type: "string",
      label: "Base URL",
      description: "WICS Base URL",
      default: "https://api.wics.nl",
    },
  },
  methods: {
    _baseUrl() {
      return this.$auth.base_url || "https://api.wics.nl";
    },
    async _makeRequest({ $ = this, path, ...opts }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this.$auth.api_key}`,
          "Content-Type": "application/json",
        },
        ...opts,
      });
    },
    async getOrder(order_id) {
      return this._makeRequest({
        path: `/orders/${order_id}`,
      });
    },
    async listOrders(params = {}) {
      return this._makeRequest({
        path: "/orders",
        params,
      });
    },
    async createOrder(data) {
      return this._makeRequest({
        method: "POST",
        path: "/orders",
        data,
      });
    },
  },
  async auth() {
    return this._makeRequest({
      path: "/auth/verify",
    });
  },
};
