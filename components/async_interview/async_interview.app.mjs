import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "async_interview",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://app.asyncinterview.ai/api";
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.api_token}`,
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
    listInterviewResponses(opts = {}) {
      return this._makeRequest({
        path: "/interview_responses",
        ...opts,
      });
    },
  },
};
