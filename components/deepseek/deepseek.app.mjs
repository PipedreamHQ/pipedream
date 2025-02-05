import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "deepseek",
  version: "0.0.{{ts}}",
  propDefinitions: {
    messages: {
      type: "string[]",
      label: "Messages",
      description: "The messages for the chat conversation as JSON strings. Each message should be a JSON string like '{\"role\": \"user\", \"content\": \"Hello!\"}'.",
    },
    model: {
      type: "string",
      label: "Model",
      description: "The model to use for generating the chat completion.",
      async options() {
        const models = await this.listModels();
        return models.map((model) => ({
          label: `${model.id} (Owned by ${model.owner})`,
          value: model.id,
        }));
      },
    },
    frequencyPenalty: {
      type: "number",
      label: "Frequency Penalty",
      description: "Amount to penalize new tokens based on their frequency in the text so far.",
      optional: true,
    },
    maxTokens: {
      type: "integer",
      label: "Max Tokens",
      description: "The maximum number of tokens to generate in the completion.",
      optional: true,
    },
    presencePenalty: {
      type: "number",
      label: "Presence Penalty",
      description: "Amount to penalize new tokens based on their presence in the text so far.",
      optional: true,
    },
    responseFormat: {
      type: "string",
      label: "Response Format",
      description: "The format of the response.",
      optional: true,
    },
    stop: {
      type: "string[]",
      label: "Stop Sequences",
      description: "Sequences where the API will stop generating further tokens.",
      optional: true,
    },
    stream: {
      type: "boolean",
      label: "Stream",
      description: "Whether to stream the response.",
      optional: true,
    },
    streamOptions: {
      type: "string",
      label: "Stream Options",
      description: "Options for streaming the response.",
      optional: true,
    },
    temperature: {
      type: "number",
      label: "Temperature",
      description: "Sampling temperature, between 0 and 2.",
      optional: true,
    },
    topP: {
      type: "number",
      label: "Top P",
      description: "Nucleus sampling probability, between 0 and 1.",
      optional: true,
    },
    tools: {
      type: "string[]",
      label: "Tools",
      description: "Tools to be used in the generation.",
      optional: true,
    },
    toolChoice: {
      type: "string",
      label: "Tool Choice",
      description: "Choice of tool.",
      optional: true,
    },
    logprobs: {
      type: "integer",
      label: "Log Probs",
      description: "Number of top log probabilities to return.",
      optional: true,
    },
    topLogprobs: {
      type: "integer",
      label: "Top Log Probabilities",
      description: "Return the top log probabilities.",
      optional: true,
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://api.deepseek.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $, method = "GET", path = "/", headers, ...otherOpts
      } = opts;
      return axios($, {
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.api_key}`,
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        ...otherOpts,
      });
    },
    async createModelResponse() {
      const data = {
        messages: this.messages.map((message) => JSON.parse(message)),
        model: this.model,
      };
      if (this.frequencyPenalty !== undefined) data.frequency_penalty = this.frequencyPenalty;
      if (this.maxTokens !== undefined) data.max_tokens = this.maxTokens;
      if (this.presencePenalty !== undefined) data.presence_penalty = this.presencePenalty;
      if (this.responseFormat !== undefined) data.response_format = this.responseFormat;
      if (this.stop !== undefined) data.stop = this.stop;
      if (this.stream !== undefined) data.stream = this.stream;
      if (this.streamOptions !== undefined) data.stream_options = this.streamOptions;
      if (this.temperature !== undefined) data.temperature = this.temperature;
      if (this.topP !== undefined) data.top_p = this.topP;
      if (this.tools !== undefined) data.tools = this.tools;
      if (this.toolChoice !== undefined) data.tool_choice = this.toolChoice;
      if (this.logprobs !== undefined) data.logprobs = this.logprobs;
      if (this.topLogprobs !== undefined) data.top_logprobs = this.topLogprobs;

      return this._makeRequest({
        method: "POST",
        path: "/chat/completions",
        data,
      });
    },
    async getUserBalance() {
      return this._makeRequest({
        method: "GET",
        path: "/user/balance",
      });
    },
    async listModels() {
      return this._makeRequest({
        method: "GET",
        path: "/models",
      });
    },
  },
};
