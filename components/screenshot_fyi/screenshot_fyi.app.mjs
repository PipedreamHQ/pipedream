import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "screenshot_fyi",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://screenshot.fyi/api";
    },
    _makeRequest({
      $ = this,
      path,
      params,
      ...otherOpts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        params: {
          ...params,
          accessKey: this.$auth.access_key,
        },
        ...otherOpts,
      });
    },
    takeScreenshot(opts = {}) {
      return this._makeRequest({
        path: "/take",
        ...opts,
      });
    },
  },
};
