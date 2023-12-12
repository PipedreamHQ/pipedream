import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "dribbble",
  propDefinitions: {},
  methods: {
    _accessToken() {
      return this.$auth.oauth_access_token;
    },
    _apiUrl() {
      return "https://api.dribbble.com/v2";
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this._accessToken()}`,
        },
        ...args,
      });
    },
    async getShots(args = {}) {
      return this._makeRequest({
        path: "/user/shots",
        ...args,
      });
    },
  },
};
