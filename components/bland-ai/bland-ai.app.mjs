import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "bland_ai",
  version: "0.0.{{ts}}",
  propDefinitions: {
    callId: {
      type: "string",
      label: "Call ID",
      description: "The unique identifier of the call",
    },
    callRecordOrStream: {
      type: "any",
      label: "Call Record or Stream",
      description: "The call record or stream data for analysis",
    },
    goal: {
      type: "string",
      label: "Goal",
      description: "The overall purpose of the call for analysis",
    },
    questions: {
      type: "string[]",
      label: "Questions",
      description: "An array of questions to be analyzed for the call",
    },
    uniqueCallIdentity: {
      type: "string",
      label: "Unique Call Identity",
      description: "The unique identity of the ongoing call to be terminated",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.bland.ai/v1";
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
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async analyzeCall(callRecordOrStream, goal, questions) {
      return this._makeRequest({
        method: "POST",
        path: "/analyze",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          callRecordOrStream,
          goal,
          questions,
        },
      });
    },
    async terminateCall(uniqueCallIdentity) {
      return this._makeRequest({
        method: "POST",
        path: `/calls/${uniqueCallIdentity}/stop`,
      });
    },
    async getTranscript(callId) {
      return this._makeRequest({
        path: `/calls/${callId}/transcript`,
      });
    },
  },
};
