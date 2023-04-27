import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "intellexer_api",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "http://api.intellexer.com";
    },
    _authParams(params = {}) {
      return {
        ...params,
        apikey: `${this.$auth.api_key}`,
      };
    },
    async _makeRequest({
      $ = this,
      path,
      params,
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        params: this._authParams(params),
        ...args,
      });
    },
    summarizeDocument(args = {}) {
      return this._makeRequest({
        path: "/summarize",
        ...args,
      });
    },
    extractNamedEntities(args = {}) {
      return this._makeRequest({
        path: "/recognizeNe",
        ...args,
      });
    },
    recognizeLanguage(args = {}) {
      return this._makeRequest({
        path: "/recognizeLanguage",
        method: "POST",
        ...args,
      });
    },
  },
};
