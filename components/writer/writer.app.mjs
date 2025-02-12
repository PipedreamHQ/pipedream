import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "writer",
  propDefinitions: {
    messages: {
      type: "string",
      label: "Messages",
      description: "Array of messages to be used for generating completion. Use the format: `[{ \"role\": \"user\", \"content\": \"Hello\" }]`. The possible roles are `user`, `asssistant`, 'system' and 'tool'",
    },
    logprobs: {
      type: "boolean",
      label: "Log Probabilities",
      description: "Specifies whether to return log probabilities of the output tokens",
      optional: true,
    },
    maxTokens: {
      type: "integer",
      label: "Max Tokens",
      description: "Defines the maximum number of tokens that the model can generate in the response",
      optional: true,
    },
    number: {
      type: "integer",
      label: "Number",
      description: "Specifies the number of completions to generate",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.writer.com/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          "Authorization": `Bearer ${this.$auth.api_key}`,
          "Content-Type": "application/json",
          ...headers,
        },
      });
    },

    async sendPrompt(args = {}) {
      return this._makeRequest({
        path: "/chat",
        method: "post",
        ...args,
      });
    },
  },
};
