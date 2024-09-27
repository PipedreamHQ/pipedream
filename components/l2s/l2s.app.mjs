import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "l2s",
  methods: {
    _baseUrl() {
      return "https://api.l2s.is";
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...opts,
      });
    },
    shortenUrl(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/url",
        ...opts,
      });
    },
  },
};
