import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "veriff",
  methods: {
    _baseUrl() {
      return `${this.$auth.api_url}/v1`;
    },
    _headers(headers = {}) {
      return {
        "content-type": "application/json",
        "x-auth-client": `${this.$auth.api_key}`,
        ...headers,
      };
    },
    _makeRequest({
      $ = this, path, headers, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(headers),
        ...opts,
      });
    },
    createVerificationSession(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/sessions",
        ...opts,
      });
    },
    getSessionDecision({
      sessionId, ...opts
    }) {
      return this._makeRequest({
        path: `/sessions/${sessionId}/decision`,
        ...opts,
      });
    },
  },
};
