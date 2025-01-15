import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "change_photos",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://www.change.photos/api";
    },
    _makeRequest({
      $ = this,
      path,
      ...otherOpts
    }) {
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
      });
    },
    transformImage(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/change",
        ...opts,
      });
    },
  },
};
