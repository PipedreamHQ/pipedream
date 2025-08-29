import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "dhl",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return this.$auth.api_url;
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          "dhl-api-key": `${this.$auth.api_key}`,
        },
        ...opts,
      });
    },
    getTracking(opts = {}) {
      return this._makeRequest({
        path: "/track/shipments",
        ...opts,
      });
    },
  },
};
