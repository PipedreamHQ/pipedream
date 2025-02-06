import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "shortpixel",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://cdn.shortpixel.ai";
    },
    _makeRequest({
      $ = this,
      path,
      params,
      ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        params: {
          ...params,
          key: this.$auth.api_key,
        },
        ...opts,
      });
    },
    optimizeImage({
      params, url, ...opts
    }) {
      return this._makeRequest({
        path: `/client/${params}/${url}`,
        ...opts,
      });
    },
  },
};
