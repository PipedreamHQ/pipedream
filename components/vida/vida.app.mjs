import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "vida",
  methods: {
    _baseUrl() {
      return "https://api.vida.dev/api/v2";
    },
    _params(params = {}) {
      return {
        ...params,
        token: `${this.$auth.api_token}`,
      };
    },
    _makeRequest({
      $ = this, path, params, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        params: this._params(params),
        ...opts,
      });
    },
    addContext(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/context",
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
