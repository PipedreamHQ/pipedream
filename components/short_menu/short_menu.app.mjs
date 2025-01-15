import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "short_menu",
  methods: {
    _baseUrl() {
      return "https://api.shortmenu.com";
    },
    _makeRequest({
      $ = this,
      path,
      ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          "x-api-key": `${this.$auth.api_key}`,
        },
        ...opts,
      });
    },
    createShortLink(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/links",
        ...opts,
      });
    },
  },
};
