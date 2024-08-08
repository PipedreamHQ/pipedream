import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "easyhire",
  propDefinitions: {
    candidateId: {
      type: "string",
      label: "Candidate ID",
      description: "The ID of the candidate to be assessed",
    },
    evaluationScore: {
      type: "integer",
      label: "Evaluation Score",
      description: "The score of the candidate's evaluation",
    },
    comments: {
      type: "string",
      label: "Comments",
      description: "Comments about the candidate's performance",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://easyhire.ai/api";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Content-Type": "application/json",
          "Authorization": `Api-Key ${this.$auth.api_key}`,
        },
      });
    },
    async assessCandidate({
      candidateId, evaluationScore, comments,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/candidate/${candidateId}/score/`,
        data: {
          score: evaluationScore,
          comments: comments || "",
        },
      });
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
