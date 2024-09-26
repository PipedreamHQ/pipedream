import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "melo",
  methods: {
    _baseUrl() {
      return `https://${this.$auth.environment}.notif.immo`;
    },
    _headers() {
      return {
        "Content-Type": "application/json",
        "X-API-KEY": `${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this,
      path,
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...args,
      });
    },
    searchProperties(args = {}) {
      return this._makeRequest({
        path: "/documents/properties",
        ...args,
      });
    },
    createSearch(args = {}) {
      return this._makeRequest({
        path: "/searches",
        method: "POST",
        ...args,
      });
    },
  },
};
