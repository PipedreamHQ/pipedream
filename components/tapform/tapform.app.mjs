import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "tapform",
  methods: {
    _apiUrl() {
      return "https://apimvp.tapform.io/api";
    },
    _getHeaders() {
      return {
        "tapform-api-key": `${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._apiUrl()}/${path}`,
        headers: this._getHeaders(),
        ...opts,
      });
    },
    listLeads(args = {}) {
      return this._makeRequest({
        path: "leads/zapier-leads",
        ...args,
      });
    },
  },
};
