import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "niftykit",
  methods: {
    _baseUrl() {
      return "https://api.niftykit.com";
    },
    _headers() {
      return {
        "accept": "application/json",
        "x-api-key": `${this.$auth.api_access_key}`,
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
    listTokens(args = {}) {
      return this._makeRequest({
        path: "/v3/collections/tokens",
        ...args,
      });
    },
    createMintLink(args = {}) {
      return this._makeRequest({
        path: "/onboarding/mintLinks",
        method: "POST",
        ...args,
      });
    },
  },
};
