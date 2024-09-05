import { axios } from "@pipedream/platform";
import base from "../gmail/gmail.app.mjs";

export default {
  ...base,
  type: "app",
  app: "gmail_custom_oauth",
  methods: {
    ...base.methods,
    _apiUrl() {
      return "https://www.googleapis.com/gmail/v1/users/me";
    },
    _getHeaders() {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    async _makeRequest({
      $ = this, path, ...opts
    }) {
      const config = {
        url: `${this._apiUrl()}/${path}`,
        headers: this._getHeaders(),
        ...opts,
      };

      return axios($, config);
    },
  },
};
