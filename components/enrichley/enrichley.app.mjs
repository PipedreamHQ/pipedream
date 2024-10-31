import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "enrichley",
  methods: {
    _baseUrl() {
      return "https://api.enrichley.io/api/v1";
    },
    _makeRequest({
      $ = this,
      path,
      ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          "Accept": "application/json",
          "X-API-Key": `${this.$auth.api_key}`,
        },
        ...opts,
      });
    },
    validateEmail(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/validate-single-email",
        ...opts,
      });
    },
  },
};
