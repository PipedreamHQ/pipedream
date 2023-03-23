import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "exact",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return `https://start.exactonline.${this.$auth.region}/api/v1`;
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    async _makeRequest({
      $ = this,
      path,
      ...args
    }) {
      const config = {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...args,
      }; console.log(config);
      return axios($, config);
    },
    async getDivision() {
      const { d: { results } } = await this._makeRequest({
        path: "/current/Me?$select=CurrentDivision",
      });
      return results[0].CurrentDivision;
    },
    createWebhook(division, args = {}) {
      return this._makeRequest({
        path: `/${division}/webhooks/WebhookSubscriptions`,
        method: "POST",
        ...args,
      });
    },
    deleteWebhook(division, key) {
      return this._makeRequest({
        path: `/${division}/webhooks/WebhookSubscriptions(guid'${key}')`,
        method: "DELETE",
      });
    },
    getSubscriptions(division, args = {}) {
      return this._makeRequest({
        path: `/${division}/subscription/Subscriptions`,
        ...args,
      });
    },
  },
};
