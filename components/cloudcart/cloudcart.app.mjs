import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "cloudcart",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return `https://${this.$auth.domain}.cloudcart.net/api/v2`;
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          "X-CloudCart-ApiKey": `${this.$auth.api_key}`,
          "Content-Type": "application/vnd.api+json",
        },
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
    deleteWebhook(webhookId) {
      return this._makeRequest({
        method: "DELETE",
        path: `/webhooks/${webhookId}`,
      });
    },
  },
};
