import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "fixer_io",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://data.fixer.io/api";
    },
    _makeRequest({
      $ = this, path, params, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          Accept: "application/json",
        },
        params: {
          ...params,
          access_key: `${this.$auth.api_key}`,
        },
        ...opts,
      });
    },
    convertCurrency(opts = {}) {
      return this._makeRequest({
        path: "/convert",
        ...opts,
      });
    },
  },
};
