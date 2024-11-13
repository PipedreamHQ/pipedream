import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "zerobounce",
  methods: {
    _baseUrl() {
      return "https://api.zerobounce.net/v2";
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        url,
        params,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: url || `${this._baseUrl()}${path}`,
        params: {
          ...params,
          api_key: this.$auth.api_key,
        },
      });
    },
    validateEmail(opts = {}) {
      return this._makeRequest({
        path: "/validate",
        ...opts,
      });
    },
    getReliabilityScore(opts = {}) {
      return this._makeRequest({
        path: "/scoring",
        ...opts,
      });
    },
    validateEmailsInFile(opts = {}) {
      return this._makeRequest({
        method: "POST",
        url: "https://bulkapi.zerobounce.net/v2/sendfile",
        ...opts,
      });
    },
    getResultsFile(opts = {}) {
      return this._makeRequest({
        url: "https://bulkapi.zerobounce.net/v2/getfile",
        ...opts,
      });
    },
  },
};
