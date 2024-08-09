import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "blogify",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://api.blogify.ai/public-api/v1";
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...opts,
      });
    },
    createWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/subscribe",
        ...opts,
      });
    },
    deleteWebhook(opts = {}) {
      return this._makeRequest({
        method: "DELETE",
        path: "/subscribe",
        ...opts,
      });
    },
  },
};
