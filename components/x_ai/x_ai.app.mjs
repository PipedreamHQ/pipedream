import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "x_ai",
  propDefinitions: {
    model: {
      type: "string",
      label: "Model",
      description: "ID of the embedding model to use",
      async options() {
        const response = await this.getModels();
        const modelsIds = response.data;
        return modelsIds.map(({ id }) => ({
          value: id,
        }));
      },
    },
    embeddingModel: {
      type: "string",
      label: "Embedding Models",
      description: "ID of the embedding model to use",
      async options() {
        const response = await this.getEmbeddingModels();
        const embeddingModelsIds = response.models;
        return embeddingModelsIds.map(({ id }) => ({
          value: id,
        }));
      },
    },
    prompt: {
      type: "string",
      label: "Prompt",
      description: "Prompt for the request",
    },
    message: {
      type: "string",
      label: "Message",
      description: "Message for the chat completion",
    },
    echo: {
      type: "boolean",
      label: "Echo",
      description: "Option to include the original prompt in the response along with the generated completion",
      optional: true,
    },
    frequencyPenalty: {
      type: "string",
      label: "Frequency Penalty",
      description: "Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim",
      optional: true,
    },
    logprobs: {
      type: "boolean",
      label: "Log Probabilities",
      description: "Include the log probabilities on the `logprobs` most likely output tokens, as well the chosen tokens",
      optional: true,
    },
    maxTokens: {
      type: "integer",
      label: "Max Tokens",
      description: "Limits the number of tokens that can be produced in the output",
      optional: true,
    },
    n: {
      type: "integer",
      label: "Completion Number",
      description: "Determines how many completion sequences to produce for each prompt. Be cautious with its use due to high token consumption",
      optional: true,
    },
    presencePenalty: {
      type: "string",
      label: "Presence Penalty",
      description: "Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics",
      optional: true,
    },
    seed: {
      type: "integer",
      label: "Seed",
      description: "If specified, our system will make a best effort to sample deterministically",
      optional: true,
    },
    stream: {
      type: "boolean",
      label: "Stream",
      description: "Whether to stream back partial progress. If set, tokens will be sent as data-only server-sent events as they become available",
      optional: true,
    },
    suffix: {
      type: "string",
      label: "Suffix",
      description: "Optional string to append after the generated text",
      optional: true,
    },
    temperature: {
      type: "string",
      label: "Temperature",
      description: "What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic",
      optional: true,
    },
    topP: {
      type: "string",
      label: "Nucleus Sampling",
      description: "An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with `top_p` probability mass. So 0.1 means only the tokens comprising the top 10% probability mass are considered",
      optional: true,
    },
    user: {
      type: "string",
      label: "User",
      description: "A unique identifier representing your end-user, which can help xAI to monitor and detect abuse",
      optional: true,
    },
    dimensions: {
      type: "integer",
      label: "Dimensions",
      description: "The number of dimensions the resulting output embeddings should have",
      optional: true,
    },
    encodingFormat: {
      type: "string",
      label: "Encoding Format",
      description: "The format to return the embeddings in",
      optional: true,
      options: constants.ENCODING_FORMATS,
    },
    input: {
      type: "string[]",
      label: "Input",
      description: "Text input to be converted into an embedding",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.x.ai";
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
          ...headers,
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
      });
    },
    async postChatCompletion(args = {}) {
      return this._makeRequest({
        path: "/v1/chat/completions",
        method: "post",
        ...args,
      });
    },
    async postCompletion(args = {}) {
      return this._makeRequest({
        path: "/v1/completions",
        method: "post",
        ...args,
      });
    },
    async createEmbeddings(args = {}) {
      return this._makeRequest({
        path: "/v1/embeddings",
        method: "post",
        ...args,
      });
    },
    async getModel({
      model, ...args
    }) {
      return this._makeRequest({
        path: `/v1/models/${model}`,
        ...args,
      });
    },
    async getModels(args = {}) {
      return this._makeRequest({
        path: "/v1/models",
        ...args,
      });
    },
    async getEmbeddingModels(args = {}) {
      return this._makeRequest({
        path: "/v1/embedding-models",
        ...args,
      });
    },
  },
};
