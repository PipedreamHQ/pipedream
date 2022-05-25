import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "vend",
  propDefinitions: {},
  methods: {
    _domainPrefix() {
      return this.$auth.domain_prefix;
    },
    _accessToken() {
      return this.$auth.oauth_access_token;
    },
    _apiUrl() {
      return `https://${this._domainPrefix()}.vendhq.com/api/2.0`;
    },
    async _makeRequest(path, options = {}, $ = undefined) {
      return axios($ ?? this, {
        url: `${this._apiUrl()}/${path}`,
        headers: {
          Authorization: `Bearer ${this._accessToken()}`,
        },
        ...options,
      });
    },
    async createWebhook(data) {
      const response = await this._makeRequest("webhooks", {
        method: "post",
        data,
      });

      return response.data;
    },
    async removeWebhook(webhookId) {
      return this._makeRequest(`webhooks/${webhookId}`, {
        method: "delete",
      });
    },
  },
};
