import { axios } from "@pipedream/platform";
import { BASE_URL } from "./common/constants.mjs";

export default {
  type: "app",
  app: "featherless",
  // Shared across Create Chat Completion and Create Text Completion. Sampling
  // params are strings where the value is a float (Pipedream integer props can't
  // carry decimals) and parsed to numbers in each action's run().
  propDefinitions: {
    model: {
      type: "string",
      label: "Model",
      description: "The model ID to use, e.g. `Qwen/Qwen2.5-7B-Instruct`. Run **List Models** first to discover valid model IDs available to your account (do NOT guess).",
    },
    maxTokens: {
      type: "integer",
      label: "Max Tokens",
      description: "Maximum number of tokens to generate (maps to `max_tokens`).",
      optional: true,
    },
    minTokens: {
      type: "integer",
      label: "Min Tokens",
      description: "Minimum number of tokens to generate (maps to `min_tokens`).",
      optional: true,
    },
    temperature: {
      type: "string",
      label: "Temperature",
      description: "Sampling temperature as a float, e.g. `0.7`. Parsed to a number in run().",
      optional: true,
    },
    topP: {
      type: "string",
      label: "Top P",
      description: "Nucleus sampling probability as a float, e.g. `0.9` (maps to `top_p`).",
      optional: true,
    },
    topK: {
      type: "integer",
      label: "Top K",
      description: "Top-k sampling cutoff (maps to `top_k`).",
      optional: true,
    },
    minP: {
      type: "string",
      label: "Min P",
      description: "Minimum probability threshold as a float, e.g. `0.05` (maps to `min_p`).",
      optional: true,
    },
    presencePenalty: {
      type: "string",
      label: "Presence Penalty",
      description: "Presence penalty as a float, e.g. `0.0` (maps to `presence_penalty`).",
      optional: true,
    },
    frequencyPenalty: {
      type: "string",
      label: "Frequency Penalty",
      description: "Frequency penalty as a float, e.g. `0.0` (maps to `frequency_penalty`).",
      optional: true,
    },
    repetitionPenalty: {
      type: "string",
      label: "Repetition Penalty",
      description: "Repetition penalty as a float, e.g. `1.0` (maps to `repetition_penalty`).",
      optional: true,
    },
    seed: {
      type: "integer",
      label: "Seed",
      description: "Random seed for deterministic sampling.",
      optional: true,
    },
    stop: {
      type: "string[]",
      label: "Stop",
      description: "One or more strings that stop generation when encountered.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return BASE_URL;
    },
    _makeRequest({
      $ = this, path, headers, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this.$auth.api_key}`,
          ...headers,
        },
        ...opts,
      });
    },
    listModels(args = {}) {
      return this._makeRequest({
        path: "/models",
        ...args,
      });
    },
    chatCompletion(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/chat/completions",
        ...args,
      });
    },
    textCompletion(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/completions",
        ...args,
      });
    },
  },
};
