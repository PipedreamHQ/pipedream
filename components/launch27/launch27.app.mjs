import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "launch27",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return `https://${this.$auth.domain}.launch27.com/v1`;
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        heaaders: {
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
        ...opts,
      });
    },
  },
};
