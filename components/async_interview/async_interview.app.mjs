import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "async_interview",
  propDefinitions: {
    interviewId: {
      type: "string",
      label: "Interview ID",
      description: "The ID of the interview.",
    },
    candidateEmail: {
      type: "string",
      label: "Candidate's Email",
      description: "The email of the candidate.",
      optional: true,
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://api.asyncinterview.com/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        data,
        params,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
        data,
        params,
      });
    },
    async emitNewInterviewResponse(interviewId, candidateEmail = null) {
      const data = {
        interviewId,
      };
      if (candidateEmail) data.candidateEmail = candidateEmail;

      return this._makeRequest({
        method: "POST",
        path: "/new-interview-response",
        data,
      });
    },
  },
  version: "0.0.1",
};
