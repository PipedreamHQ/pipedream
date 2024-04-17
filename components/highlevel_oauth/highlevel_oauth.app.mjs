import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "highlevel_oauth",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://services.leadconnectorhq.com";
    },
    async _makeRequest({
      $ = this,
      headers,
      ...otherOpts
    }) {
      return axios($, {
        baseURL: this._baseUrl(),
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
        ...otherOpts,
      });
    },
  },
};
