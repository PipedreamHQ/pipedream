import { axios } from "@pipedream/platform";

const DEFAULT_MODEL = "claude-sonnet-4-5-20250929";

export default {
  type: "app",
  app: "anthropic",
  propDefinitions: {
    model: {
      type: "string",
      label: "Model",
      description: "Select the model to use. [See the documentation](https://docs.anthropic.com/en/docs/about-claude/models/overview) for more information",
      default: DEFAULT_MODEL,
      async options() {
        const response = await this.listModels();
        return response.data.map((model) => ({
          label: model.display_name,
          value: model.id,
        }));
      },
    },
  },
  methods: {
    _apiKey() {
      return this.$auth.api_key;
    },
    _apiUrl() {
      return "https://api.anthropic.com/v1";
    },
    _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        headers: {
          "x-api-key": this._apiKey(),
          "anthropic-version": "2023-06-01",
        },
        ...args,
      });
    },
    listModels(args = {}) {
      return this._makeRequest({
        path: "/models",
        ...args,
      });
    },
    createMessage(args = {}) {
      return this._makeRequest({
        path: "/messages",
        method: "post",
        ...args,
      });
    },
  },
};
