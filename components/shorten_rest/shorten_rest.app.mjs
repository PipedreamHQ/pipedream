import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "shorten_rest",
  methods: {
    _baseUrl() {
      return "https://api.shorten.rest";
    },
    _makeRequest({
      $ = this, path, headers, ...args
    } = {}) {
      const config = {
        ...args,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Content-Type": "application/json",
          "x-api-key": this.$auth.api_key,
        },
      };
      return axios($, config);
    },
    post(args = {}) {
      return this._makeRequest({
        method: "POST",
        ...args,
      });
    },
  },
};
