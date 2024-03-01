import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "heedjy",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://app.heedjy.com/api";
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        url,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: url || `${this._baseUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    listApps(opts = {}) {
      return this._makeRequest({
        path: "/apps",
        ...opts,
      });
    },
  },
};
