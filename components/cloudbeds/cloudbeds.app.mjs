import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "cloudbeds",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://api.cloudbeds.com/api/v1.3";
    },
    _makeRequest({
      $ = this, path, headers, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}/${path}`,
        headers: {
          ...headers,
          "x-api-key": `${this.$auth.api_key}`,
          "accept": "application/json",
        },
        ...opts,
      });
    },
    createWebhook(opts = {}) {
      return this._makeRequest({
        path: "/postWebhook",
        method: "POST",
        ...opts,
      });
    },
    deleteWebhook(opts = {}) {
      return this._makeRequest({
        path: "/deleteWebhook",
        method: "DELETE",
        ...opts,
      });
    },
  },
};
