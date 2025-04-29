import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "deepseek",
  methods: {
    _baseUrl() {
      return "https://api.deepseek.com";
    },
    _headers() {
      return {
        "Authorization": `Bearer ${this.$auth.api_key}`,
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
    createModelResponse(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/chat/completions",
        ...opts,
      });
    },
    getUserBalance() {
      return this._makeRequest({
        method: "GET",
        path: "/user/balance",
      });
    },
    listModels() {
      return this._makeRequest({
        method: "GET",
        path: "/models",
      });
    },
  },
};
