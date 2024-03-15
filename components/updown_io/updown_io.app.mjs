import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "updown_io",
  propDefinitions: {
    threshold: {
      type: "integer",
      label: "Threshold",
      description: "Customizable threshold for when alerts should be triggered.",
      optional: true,
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://updown.io/api";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        ...otherOpts
      } = opts;

      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
      });
    },
    async checkDown(opts = {}) {
      return this._makeRequest({
        ...opts,
        path: "/events/check.down",
      });
    },
    async checkLowBalance(opts = {}) {
      return this._makeRequest({
        ...opts,
        path: "/events/check.low_balance",
      });
    },
    async checkSslExpiration(opts = {}) {
      return this._makeRequest({
        ...opts,
        path: "/events/check.ssl_expiration",
      });
    },
  },
};
