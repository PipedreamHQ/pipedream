import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "x_ai",
  propDefinitions: {
    model: {
      type: "string",
      label: "Model",
      description: "Specifies the model to be used for the request",
      async options() {
        const response = await this.listModels();
        const modelsIds = response.data;
        return modelsIds.map(({ id }) => ({
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
    async getModel({
      model, ...args
    }) {
      return this._makeRequest({
        path: `/v1/models/${model}`,
        ...args,
      });
    },
    async listModels(args = {}) {
      return this._makeRequest({
        path: "/v1/models",
        ...args,
      });
    },
  },
};
