import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "onedesk",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://app.onedesk.com/rest/2.0";
    },
    _authToken() {
      return this.$auth.oauth_access_token;
    },
    async _makeRequest({
      $ = this,
      path,
      data,
      ...args
    }) {
      const config = {
        url: `${this._baseUrl()}${path}`,
        method: "POST",
        data: {
          ...data,
          authenticationToken: this._authToken(),
        },
        ...args,
      };
      return axios($, config);
    },
    getItemUpdates(args = {}) {
      return this._makeRequest({
        path: "/history/getItemUpdates",
        ...args,
      });
    },
  },
};
