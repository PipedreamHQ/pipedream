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
    goal: {
      type: "string",
      label: "Goal",
      description: "This is the overall purpose of the call. Provides context for the analysis to guide how the questions/transcripts are interpreted.",
    },
    questions: {
      type: "string[]",
      label: "Questions",
      description: "An array of questions to be analyzed for the call. Each question should be an array with two elements: the question text and the expected answer type. Examples: `[\"Who answered the call?\", \"human or voicemail\"]`, `[\"Positive feedback about the product: \", \"string\"]`",
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
