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
    async _makeRequest(path, options = {}, $ = undefined) {
      return axios($ ?? this, {
        url: `${this._apiUrl()}/${path}`,
        headers: {
          Authorization: `Bearer ${this._apiKey()}`,
        },
        ...options,
      });
    },
    async createWebhook(data) {
      const response = await this._makeRequest("hooks", {
        method: "post",
        data,
      });

      return response.data;
    },
    async removeWebhook(webhookId) {
      return this._makeRequest(`hooks/${webhookId}`, {
        method: "delete",
      });
    },
  },
};
