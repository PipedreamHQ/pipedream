import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "awardco",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://api.awardco.com/api";
    },
    _headers() {
      return {
        "apikey": `${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this,
      path,
      ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...opts,
      });
    },
    recognize(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/recognize",
        ...args,
      });
    },
    recognizeNoProgram(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/recognize/no-program",
        ...args,
      });
    },
    getCustomFeed(args = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/v1/custom-feed",
        ...args,
      });
    },
    getSocialFeed(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/social-feed",
        ...args,
      });
    },
  },
};
