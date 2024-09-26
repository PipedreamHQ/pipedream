import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "dropcontact",
  methods: {
    _baseUrl() {
      return "https://api.dropcontact.io";
    },
    _headers() {
      return {
        "X-Access-Token": `${this.$auth.api_key}`,
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
    getEnrichmentRequest({
      requestId, ...args
    }) {
      return this._makeRequest({
        path: `/batch/${requestId}`,
        ...args,
      });
    },
    enrichContact(args = {}) {
      return this._makeRequest({
        path: "/batch",
        method: "POST",
        ...args,
      });
    },
  },
};
