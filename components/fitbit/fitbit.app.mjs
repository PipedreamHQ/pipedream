import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "fitbit",
  propDefinitions: {},
  methods: {
    _getHeaders(headers = {}) {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        "Content-Type": "application/json",
        "user-agent": "@PipedreamHQ/pipedream v0.1",
        ...headers,
      };
    },
    _getUrl(path) {
      return `https://api.fitbit.com${path}`;
    },
    async _makeRequest({
      $,
      path,
      headers,
      ...otherConfig
    } = {}) {
      return axios($ ?? this, {
        url: this._getUrl(path),
        headers: this._getHeaders(headers),
        ...otherConfig,
      });
    },
    async getActivitySummary({
      date,
      ...args
    } = {}) {
      return this._makeRequest({
        method: "GET",
        path: `/1/user/-/activities/date/${date}.json`,
        ...args,
      });
    },
  },
};
