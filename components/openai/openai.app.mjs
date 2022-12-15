import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "openai",
  propDefinitions: {
    modelId: {
      label: "Model ID",
      description: "ID of the model to use",
      type: "string",
      async options() {
        const { data: models } = await this.getModels();

        return models.map((model) => model.id);
      },
    },
  },
  methods: {
    _apiKey() {
      return this.$auth.api_key;
    },
    _apiUrl() {
      return "https://api.openai.com/v1";
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this._apiKey()}`,
        },
        ...args,
      });
    },
    async getModels(args = {}) {
      return this._makeRequest({
        path: "/models",
        ...args,
      });
    },
    async sendPrompt(args = {}) {
      return this._makeRequest({
        path: "/completions",
        method: "post",
        ...args,
      });
    },
    async createImage(args = {}) {
      return this._makeRequest({
        path: "/images/generations",
        method: "post",
        ...args,
      });
    },
  },
};
