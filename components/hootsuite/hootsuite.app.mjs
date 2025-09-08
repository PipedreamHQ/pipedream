import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "hootsuite",
  propDefinitions: {},
  methods: {
    _oauthAccessToken() {
      return this.$auth.oauth_access_token;
    },
    _apiUrl() {
      return "https://platform.hootsuite.com";
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this._oauthAccessToken()}`,
        },
        ...args,
      });
    },
    async getPosts({ ...args } = {}) {
      return this._makeRequest({
        path: "/v1/messages",
        ...args,
      });
    },
  },
};
