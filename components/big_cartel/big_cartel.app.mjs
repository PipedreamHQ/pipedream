import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "big_cartel",
  propDefinitions: {},
  methods: {
    _getUrl(path) {
      return `https://api.bigcartel.com/v1${path}`;
    },
    _getAccessToken() {
      return this.$auth.oauth_access_token;
    },
    _getAccountId() {
      return this.$auth.account_id;
    },
    _getHeaders(headers = {}) {
      return {
        "Authorization": `Bearer ${this._getAccessToken()}`,
        "Accept": "application/vnd.api+json",
        "Content-type": "application/vnd.api+json",
        "User-Agent": "@PipedreamHQ/pipedream v0.1",
        ...headers,
      };
    },
    async _makeRequest({
      $ = this, path, headers, ...otherConfig
    } = {}) {
      const config = {
        url: this._getUrl(path),
        headers: this._getHeaders(headers),
        ...otherConfig,
      };
      return axios($, config);
    },
    async getOrders(args = {}) {
      return this._makeRequest({
        path: `/accounts/${this._getAccountId()}/orders`,
        ...args,
      });
    },
    async getProducts(args = {}) {
      return this._makeRequest({
        path: `/accounts/${this._getAccountId()}/products`,
        ...args,
      });
    },
  },
};
