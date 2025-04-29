import { axios } from "@pipedream/platform";
import { EFFORT_OPTIONS } from "./common/constants.mjs";

export default {
  type: "app",
  app: "openrouter",
  propDefinitions: {
    model: {
      type: "string",
      label: "Model",
      description: "The model ID to use.",
      async options() {
        const { data } = await this.listModels();

        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    maxTokens: {
      type: "integer",
      label: "Max Tokens",
      description: "Maximum number of tokens. **(range: [1, context_length))**.",
      min: 1,
      optional: true,
    },
    temperature: {
      type: "string",
      label: "Temperature",
      description: "Sampling temperature. **(range: [0, 2])**.",
      optional: true,
    },
    seed: {
      type: "integer",
      label: "Seed",
      description: "Seed for deterministic outputs.",
      optional: true,
    },
    topP: {
      type: "string",
      label: "Top P",
      description: "Top-p sampling value. **(range: (0, 1])**.",
      optional: true,
    },
    topK: {
      type: "integer",
      label: "Top K",
      description: "Top-k sampling value. **(range: [1, Infinity))**.",
      min: 1,
      optional: true,
    },
    frequencyPenalty: {
      type: "string",
      label: "Frequency Penalty",
      description: "Frequency penalty. **(range: [-2, 2])**.",
      optional: true,
    },
    presencePenalty: {
      type: "string",
      label: "Presence Penalty",
      description: "Presence penalty. **(range: [-2, 2])**.",
      optional: true,
    },
    repetitionPenalty: {
      type: "string",
      label: "Repetition Penalty",
      description: "Repetition penalty. **(range: (0, 2])**.",
      optional: true,
    },
    logitBias: {
      type: "string[]",
      label: "Logit Bias",
      description: "A list of token IDs to bias values.",
      optional: true,
    },
    togLogprobs: {
      type: "integer",
      label: "Top Logprobs",
      description: "Number of top log probabilities to return.",
      optional: true,
    },
    minP: {
      type: "string",
      label: "Min P",
      description: "Minimum probability threshold. **(range: [0, 1])**.",
      optional: true,
    },
    topA: {
      type: "integer",
      label: "Top A",
      description: "Alternate top sampling parameter. **(range: [0, 1])**.",
      optional: true,
    },
    transforms: {
      type: "string[]",
      label: "Transforms",
      description: "List of prompt transforms (OpenRouter-only).",
      optional: true,
    },
    sort: {
      type: "string",
      label: "Sort",
      description: "Sort preference (e.g., price, throughput).",
      optional: true,
    },
    effort: {
      type: "string",
      label: "Reasoning Effort",
      description: "OpenAI-style reasoning effort setting.",
      options: EFFORT_OPTIONS,
      optional: true,
    },
    reasoningMaxTokens: {
      type: "string",
      label: "Reasoning Max Tokens",
      description: "Non-OpenAI-style reasoning effort setting. Cannot be used simultaneously with effort.",
      optional: true,
    },
    exclude: {
      type: "boolean",
      label: "Reasoning Exclude",
      description: "Whether to exclude reasoning from the response",
      optional: true,
    },
  },
  methods: {
    _apiUrl() {
      return "https://openrouter.ai/api/v1";
    },
    _getHeaders() {
      return {
        "Authorization": `Bearer ${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._apiUrl()}/${path}`,
        headers: this._getHeaders(),
        ...opts,
      });
    },
    listModels() {
      return this._makeRequest({
        path: "models",
      });
    },
    sendChatCompetionRequest(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "chat/completions",
        ...opts,
      });
    },
    sendCompetionRequest(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "completions",
        ...opts,
      });
    },
  },
};
