import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "knocommerce",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://app-api.knocommerce.com/api/rest";
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
        ...opts,
      });
    },
    createWebhook(opts = {}) {
      return this._makeRequest({
        path: "/webhooks",
        method: "post",
        ...opts,
      });
    },
    deleteWebhook({
      hookId, ...opts
    }) {
      return this._makeRequest({
        path: `/webhooks/${hookId}`,
        method: "delete",
        ...opts,
      });
    },
  },
};
