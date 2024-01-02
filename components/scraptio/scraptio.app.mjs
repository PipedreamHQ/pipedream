import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "scraptio",
  methods: {
    _baseUrl() {
      return "https://api.scraptio.com";
    },
    _headers() {
      return {
        "Content-Type": "application/json",
      };
    },
    _auth() {
      return {
        "api_key": `${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this, path, data, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        data: {
          ...data,
          ...this._auth(),
        },
        ...opts,
      });
    },
    scrape(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/scrape",
        ...opts,
      });
    },
  },
};
