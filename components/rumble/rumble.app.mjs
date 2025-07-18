import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "rumble",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://rumble.com/-livestream-api";
    },
    _makeRequest({
      $ = this,
      path,
      params = {},
      ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        params: {
          ...params,
          key: this.$auth.live_streaming_api_key,
        },
        ...opts,
      });
    },
    getData(opts = {}) {
      return this._makeRequest({
        path: "/get-data",
        ...opts,
      });
    },
  },
};
