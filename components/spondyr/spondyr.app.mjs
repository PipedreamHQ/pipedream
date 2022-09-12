import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "spondyr",
  propDefinitions: {},
  methods: {
    _apiKey() {
      return this.$auth.api_key;
    },
    _appToken() {
      return this.$auth.app_token;
    },
    _apiUrl() {
      return "https://client.spondyr.io/api/v1.0.0";
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        params: {
          ...args.params,
          APIKey: this._apiKey(),
          ApplicationToken: this._apiUrl(),
        },
        ...args,
      });
    },
  },
};
