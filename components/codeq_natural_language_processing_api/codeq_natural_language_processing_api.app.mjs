import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "codeq_natural_language_processing_api",
  propDefinitions: {},
  methods: {
    _apiUrl() {
      return "https://api.codeq.com";
    },
    _getHeaders() {
      return {
        "Content-Type": "application/json",
      };
    },
    _getAuth() {
      return {
        "user_id": this.$auth.user_id,
        "user_key": this.$auth.user_key,
      };
    },
    async _makeRequest({
      $ = this, path, data, ...opts
    }) {
      const config = {
        url: `${this._apiUrl()}/${path}`,
        headers: this._getHeaders(),
        data: {
          ...data,
          ...this._getAuth(),
        },
        ...opts,
      };

      return axios($, config);
    },
    analyzeText(args = {}) {
      return this._makeRequest({
        path: "v1",
        method: "POST",
        ...args,
      });
    },
    textSimilarity(args = {}) {
      return this._makeRequest({
        path: "v1_text_similarity",
        method: "POST",
        ...args,
      });
    },
  },
};
