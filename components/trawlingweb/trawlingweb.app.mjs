import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "trawlingweb",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://api.trawlingweb.com";
    },
    _makeRequest({
      $ = this, params = {}, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}`,
        params: {
          ...params,
          token: `${this.$auth.api_token}`,
        },
        ...opts,
      });
    },
    searchNews(opts = {}) {
      return this._makeRequest({
        ...opts,
      });
    },
  },
};
