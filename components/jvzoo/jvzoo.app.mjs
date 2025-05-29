import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "jvzoo",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://api.jvzoo.com/v2.0";
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        auth: {
          username: `${this.$auth.api_key}`,
          password: "x",
        },
        headers: {
          "Content-Type": "application/json",
        },
        ...opts,
      });
    },
    getLatestTransactions({
      paykey, ...opts
    }) {
      return this._makeRequest({
        path: `/latest-transactions/${paykey}`,
        ...opts,
      });
    },
  },
};
