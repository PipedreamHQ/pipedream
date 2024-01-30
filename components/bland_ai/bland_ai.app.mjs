import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "bland_ai",
  propDefinitions: {
    callId: {
      type: "string",
      label: "Call ID",
      description: "The unique identifier of the call",
      async options() {
        const calls = await this.listCalls();
        return calls?.map((call) => ({
          label: `From ${call.from} to ${call.to} (${call.call_length} minutes)`,
          value: call.c_id,
        }));
      },
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
  },
  methods: {
    _baseUrl() {
      return "https://api.bland.ai/v1";
    },
    async _makeRequest({
      $ = this,
      path,
      headers,
      ...otherOpts
    }) {
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `${this.$auth.api_key}`,
        },
      });
    },
    async analyzeCall({
      callId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/calls/${callId}/analyze`,
        ...args,
      });
    },
    async terminateCall({
      callId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/calls/${callId}/stop`,
        ...args,
      });
    },
    async getTranscript({
      callId, ...args
    }) {
      return this._makeRequest({
        path: `/calls/${callId}/`,
        ...args,
      });
    },
    async listCalls() {
      const response = await this._makeRequest({
        path: "/calls",
      });
      return response?.calls;
    },
  },
};
