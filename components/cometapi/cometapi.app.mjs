import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "cometapi",
  propDefinitions: {
    model: {
      type: "string",
      label: "Model",
      description: "The model ID to use for the request. Choose from GPT, Claude, Gemini, Grok, DeepSeek, Qwen, and other available models. Different models have different capabilities and costs.",
      async options() {
        const { data } = await this.listModels();

        return data.map(({
          id: value, id: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    maxTokens: {
      type: "integer",
      label: "Max Tokens",
      description: "Maximum number of tokens to generate in the completion. Limits response length and controls costs. Typical values: 100-500 for short responses, 1000-2000 for detailed answers, 4000+ for long content.",
      min: 1,
      optional: true,
    },
    temperature: {
      type: "string",
      label: "Temperature",
      description: "Controls randomness in the response. Range: [0.0, 2.0]. Lower values (0.1-0.3) are more focused and deterministic, good for factual tasks. Higher values (0.7-1.0) are more creative and varied, good for brainstorming. Very high values (1.5-2.0) produce more random outputs.",
      optional: true,
    },
    topP: {
      type: "string",
      label: "Top P",
      description: "Controls diversity via nucleus sampling. Range: [0.0, 1.0]. Only considers tokens with cumulative probability up to this value. 0.1 = very focused, 0.5 = balanced, 0.9 = diverse. Alternative to temperature for controlling randomness.",
      optional: true,
    },
    topK: {
      type: "integer",
      label: "Top K",
      description: "Controls diversity by limiting the number of highest probability tokens to consider. Range: [1, ∞). Typical values: 10-100.",
      min: 1,
      optional: true,
    },
    frequencyPenalty: {
      type: "string",
      label: "Frequency Penalty",
      description: "Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim. Range: [-2.0, 2.0].",
      optional: true,
    },
    presencePenalty: {
      type: "string",
      label: "Presence Penalty",
      description: "Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics. Range: [-2.0, 2.0].",
      optional: true,
    },
    repetitionPenalty: {
      type: "string",
      label: "Repetition Penalty",
      description: "Controls how much the model should avoid repeating tokens.",
      optional: true,
    },
    seed: {
      type: "integer",
      label: "Seed",
      description: "Seed for deterministic outputs. If specified, the system will make a best effort to sample deterministically.",
      optional: true,
    },
    stop: {
      type: "string[]",
      label: "Stop",
      description: "Up to 4 sequences where the API will stop generating further tokens.",
      optional: true,
    },
    stream: {
      type: "boolean",
      label: "Stream",
      description: "Whether to stream partial message deltas.",
      optional: true,
      default: false,
    },
  },
  methods: {
    _apiUrl() {
      return "https://api.cometapi.com/v1";
    },
    _getHeaders() {
      return {
        "Authorization": `Bearer ${this.$auth.api_key}`,
        "Content-Type": "application/json",
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        headers: this._getHeaders(),
        ...opts,
      }).catch((error) => {
        // Enhanced error handling for common API issues
        if (error.response) {
          const {
            status, data,
          } = error.response;
          if (status === 401) {
            throw new Error("Authentication failed. Please check your CometAPI key.");
          }
          if (status === 429) {
            throw new Error("Rate limit exceeded. Please wait before making another request.");
          }
          if (status === 400 && data?.error?.message) {
            throw new Error(`CometAPI Error: ${data.error.message}`);
          }
        }
        throw error;
      });
    },
    listModels() {
      return this._makeRequest({
        path: "/models",
      });
    },
    sendChatCompletionRequest(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/chat/completions",
        ...opts,
      });
    },
    sendCompletionRequest(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/completions",
        ...opts,
      });
    },
  },
};
