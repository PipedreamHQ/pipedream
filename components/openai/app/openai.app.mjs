import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "openai",
  propDefinitions: {
    completionModelId: {
      label: "Model",
      description: "The ID of the model to use for completions. **This action doesn't support the ChatGPT `turbo` models**. Use the **Chat** action for those, instead.",
      type: "string",
      async options() {
        return (await this.getCompletionModels()).map((model) => model.id);
      },
      default: "text-davinci-003",
    },
    chatCompletionModelId: {
      label: "Model",
      description: "The ID of the model to use for chat completions",
      type: "string",
      async options() {
        return (await this.getChatCompletionModels()).map((model) => model.id);
      },
      default: "text-davinci-003",
    },
  },
  methods: {
    _apiKey() {
      return this.$auth.api_key;
    },
    _baseApiUrl() {
      return "https://api.openai.com/v1";
    },
    async _makeRequest({
      $,
      path,
      ...args
    } = {}) {
      return axios($, {
        url: `${this._baseApiUrl()}${path}`,
        headers: {
          "Authorization": `Bearer ${this._apiKey()}`,
          "Accept": "application/json",
          "User-Agent": "@PipedreamHQ/pipedream v1.0",
        },
        ...args,
      });
    },
    async models({ $ }) {
      const { data: { data: models } } = await this._makeRequest({
        $,
        path: "/models",
      });
      return models.sort((a, b) => a?.id.localeCompare(b?.id));
    },
    async getChatCompletionModels() {
      const models = await this.models();
      return models.filter((model) => model.id.match(/turbo/gi));
    },
    async getCompletionModels() {
      const models = await this.models();
      return models.filter((model) => {
        const { id } = model;
        return (
          id.match(/^(?=.*\b(babbage|davinci|ada|curie)\b)(?!.*\b(whisper|turbo|edit|insert|search|embedding|similarity)\b).*$/gm)
        );
      });
    },
    async _makeCompletion({
      path, args,
    }) {
      const data = await this._makeRequest({
        path,
        method: "POST",
        data: args,
      });
      // Return the text of the first choice at the top-level of the returned object for convenience
      const { choices } = data;
      const text = choices?.[0]?.text;
      return {
        first_response_text: choices.length
          ? text
          : null,
        ...data,
      };
    },
    async createCompletion(args = {}) {
      return this._makeCompletion({
        path: "/completions",
        args,
      });
    },
    async createChatCompletion(args = {}) {
      return this._makeCompletion({
        path: "/chat/completions",
        args,
      });
    },
    async createImage(args = {}) {
      return this._client().createImage(args);
    },
  },
};
