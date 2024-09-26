import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "sendowl",
  propDefinitions: {},
  methods: {
    _apiKey() {
      return this.$auth.api_key;
    },
    _apiSecret() {
      return this.$auth.api_secret;
    },
    _apiUrl() {
      return "https://www.sendowl.com/api";
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        auth: {
          username: this._apiKey(),
          password: this._apiSecret(),
        },
        headers: {
          Accept: "application/json",
        },
        ...args,
      });
    },
    async getOrders(args = {}) {
      return this._makeRequest({
        path: "/v1_3/orders",
        ...args,
      });
    },
  },
};
