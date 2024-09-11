import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "akkio",
  methods: {
    _baseUrl() {
      return "https://api.akkio.com/v1";
    },
    _headers() {
      return {
        api_key: `${this.$auth.api_key}`,
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
    getAllModels(opts = {}) {
      return this._makeRequest({
        ...opts,
        method: "GET",
        path: "/models",
      });
    },
    makePrediction(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/models",
        ...opts,
      });
    },
  },
};
