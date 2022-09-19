import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "payhere",
  propDefinitions: {},
  methods: {
    _apiKey() {
      return this.$auth.api_key;
    },
    _environment() {
      return this.$auth.environment;
    },
    _apiUrl() {
      if (this._environment() === "sandbox") {
        return "https://sandbox.payhere.co/api/v1";
      }

      return "https://api.payhere.co/api/v1";
    },
    async _makeRequest({
      $ = this, path, ...args
    } = {}) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this._apiKey()}`,
        },
        ...args,
      });
    },
    async createWebhook(args = {}) {
      return this._makeRequest({
        path: "/hooks",
        method: "post",
        ...args,
      });
    },
    async removeWebhook({
      webhookId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/hooks/${webhookId}`,
        method: "delete",
        ...args,
      });
    },
  },
};
