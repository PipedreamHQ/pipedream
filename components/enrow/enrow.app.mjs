import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "enrow",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://api.enrow.io";
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        headers: {
          "x-api-key": `${this.$auth.api_key}`,
        },
      });
    },
    getResult(opts = {}) {
      return this._makeRequest({
        path: "/email/find/single",
        ...opts,
      });
    },
    executeSearch(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/email/find/single",
        ...opts,
      });
    },
  },
};
