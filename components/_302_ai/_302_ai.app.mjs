import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "_302_ai",
  propDefinitions: {
    modelId: {
      type: "string",
      label: "Model",
      description: "The ID of the model to use",
      async options() {
        const models = await this.listModels();
        return models.map((model) => ({
          label: model.id,
          value: model.id,
        }));
      },
    },
    chatCompletionModelId: {
      type: "string",
      label: "Model",
      description: "The ID of the model to use for chat completions",
      async options() {
        const models = await this.listModels();
        // Filter for chat models (similar to OpenAI)
        return models
          .filter((model) => model.id.match(/gpt|claude|gemini|llama|mistral|deepseek/gi))
          .map((model) => ({
            label: model.id,
            value: model.id,
          }));
      },
    },
    embeddingsModelId: {
      type: "string",
      label: "Model",
      description: "The ID of the embeddings model to use",
      async options() {
        const models = await this.listModels();
        // Filter for embedding models
        return models
          .filter((model) => model.id.match(/embedding/gi))
          .map((model) => ({
            label: model.id,
            value: model.id,
          }));
      },
    },
  },
  methods: {
    _apiKey() {
      return this.$auth.api_key;
    },
    _baseApiUrl() {
      return "https://api.302.ai/v1";
    },
    _makeRequest({
      $ = this,
      path,
      ...args
    } = {}) {
      return axios($, {
        ...args,
        url: `${this._baseApiUrl()}${path}`,
        headers: {
          ...args.headers,
          "Authorization": `Bearer ${this._apiKey()}`,
          "Content-Type": "application/json",
        },
      });
    },
    async listModels({ $ } = {}) {
      const { data: models } = await this._makeRequest({
        $,
        path: "/models",
      });
      return models || [];
    },
    async _makeCompletion({
      path, ...args
    }) {
      const data = await this._makeRequest({
        path,
        method: "POST",
        ...args,
      });

      // For completions, return the text of the first choice at the top-level
      let generated_text;
      if (path === "/completions") {
        const { choices } = data;
        generated_text = choices?.[0]?.text;
      }
      // For chat completions, return the assistant message at the top-level
      let generated_message;
      if (path === "/chat/completions") {
        const { choices } = data;
        generated_message = choices?.[0]?.message;
      }

      return {
        generated_text,
        generated_message,
        ...data,
      };
    },
    createChatCompletion(args = {}) {
      return this._makeCompletion({
        path: "/chat/completions",
        ...args,
      });
    },
    createEmbeddings(args = {}) {
      return this._makeRequest({
        path: "/embeddings",
        method: "POST",
        ...args,
      });
    },
  },
};
