import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "tldr",
  methods: {
    _headers() {
      return {
        "Authorization": `Bearer ${this.$auth.api_key}`,
        "Content-Type": "application/json",
      };
    },
    _baseUrl() {
      return "https://runtldr.com/apis/v1";
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
    summarize(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/summarize",
        ...opts,
      });
    },
  },
};
