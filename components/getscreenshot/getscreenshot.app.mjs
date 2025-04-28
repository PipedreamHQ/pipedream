import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "getscreenshot",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://api.rasterwise.com/v1";
    },
    async _makeRequest({
      $, params, ...otherOpts
    }) {
      return axios($, {
        ...otherOpts,
        baseURL: this._baseUrl(),
        params: {
          ...params,
          apikey: this.$auth.api_key,
        },
      });
    },
    async getScreenshot(args) {
      return this._makeRequest({
        url: "/get-screenshot",
        ...args,
      });
    },
    async getApiUsage(args) {
      return this._makeRequest({
        url: "/usage",
        ...args,
      });
    },
  },
};
