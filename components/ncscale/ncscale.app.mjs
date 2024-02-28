import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "ncscale",
  methods: {
    _baseUrl() {
      return "https://logs.ncscale.io/v1";
    },
    _logKey() {
      return `${this.$auth.logs_token}`;
    },
    _headers() {
      return {
        "Content-Type": "application/json",
      };
    },
    _makeRequest({
      $ = this, path, data = {},  ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        data: {
          ...data,
          token: this._logKey(),
        },
        ...opts,
      });
    },
    pushLog(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/logs",
        ...opts,
      });
    },
  },
};
