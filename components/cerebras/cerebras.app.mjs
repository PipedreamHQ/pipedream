import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "cerebras",
  propDefinitions: {
    model: {
      type: "string",
      label: "Model",
      description: "The model to use for the request",
      async options() {
        const { data } = await this.listModels();
        return data.map(({ id }) => id);
      },
    },
    stream: {
      type: "boolean",
      label: "Stream",
      description: "If set, partial message deltas will be sent. Tokens will be sent as data-only server-sent events as they become available",
      optional: true,
      default: false,
    },
    seed: {
      type: "integer",
      label: "Seed",
      description: "If specified, our system will make a best effort to sample deterministically, such that repeated requests with the same seed and parameters should return the same result",
      optional: true,
    },
    stop: {
      type: "string",
      label: "Stop",
      description: "Up to 4 sequences, separated by commas, where the API will stop generating further tokens. The returned text will not contain the stop sequence",
      optional: true,
    },
    temperature: {
      type: "string",
      label: "Temperature",
      description: "What sampling temperature to use, between 0 and 1.5. Higher values (e.g., 0.8) will make the output more random, while lower values (e.g., 0.2) will make it more focused and deterministic",
      optional: true,
      default: "1.0",
    },
    topP: {
      type: "string",
      label: "Top P",
      description: "An alternative to sampling with temperature, called nucleus sampling, where the model considers the tokens with top_p probability mass",
      optional: true,
      default: "1.0",
    },
    user: {
      type: "string",
      label: "User",
      description: "A unique identifier representing your end-user, which can help Cerebras to monitor and detect abuse",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.cerebras.ai/v1";
    },
    _makeRequest({
      $ = this,
      path,
      ...otherOpts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          "Authorization": `Bearer ${this.$auth.api_key}`,
        },
        ...otherOpts,
      });
    },
    listModels(opts = {}) {
      return this._makeRequest({
        path: "/models",
        ...opts,
      });
    },
    chatCompletion(opts = {}) {
      return this._makeRequest({
        path: "/chat/completions",
        method: "POST",
        ...opts,
      });
    },
    completion(opts = {}) {
      return this._makeRequest({
        path: "/completions",
        method: "POST",
        ...opts,
      });
    },
  },
};
