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
        return (await this.getCompletionModels({})).map((model) => model.id);
      },
      default: "text-davinci-003",
    },
    chatCompletionModelId: {
      label: "Model",
      description: "The ID of the model to use for chat completions",
      type: "string",
      async options() {
        return (await this.getChatCompletionModels({})).map((model) => model.id);
      },
      default: "gpt-3.5-turbo",
    },
    embeddingsModelId: {
      label: "Model",
      description: "The ID of the embeddings model to use. OpenAI recommends using `text-embedding-ada-002` for nearly all use cases: \"It's better, cheaper, and simpler to use. [Read the blog post announcement](https://openai.com/blog/new-and-improved-embedding-model)\".",
      type: "string",
      async options() {
        return (await this.getEmbeddingsModels({})).map((model) => model.id);
      },
      default: "text-embedding-ada-002",
    },
  },
  methods: {
    _apiKey() {
      return this.$auth.api_key;
    },
    _baseApiUrl() {
      return "https://api.openai.com/v1";
    },
    _commonHeaders() {
      return {
        "Authorization": `Bearer ${this._apiKey()}`,
        "Accept": "application/json",
        "User-Agent": "@PipedreamHQ/pipedream v1.0",
      };
    },
    async _makeRequest({
      $ = this,
      path,
      ...args
    } = {}) {
      return axios($, {
        url: `${this._baseApiUrl()}${path}`,
        headers: {
          ...this._commonHeaders(),
        },
        maxBodyLength: Infinity,
        ...args,
      });
    },
    async models({ $ }) {
      const { data: models } = await this._makeRequest({
        $,
        path: "/models",
      });
      return models.sort((a, b) => a?.id.localeCompare(b?.id));
    },
    async getChatCompletionModels({ $ }) {
      const models = await this.models({
        $,
      });
      return models.filter((model) => model.id.match(/turbo|gpt/gi));
    },
    async getCompletionModels({ $ }) {
      const models = await this.models({
        $,
      });
      return models.filter((model) => {
        const { id } = model;
        return (
          id.match(/^(?=.*\b(babbage|davinci|ada|curie)\b)(?!.*\b(whisper|turbo|edit|insert|search|embedding|similarity|001)\b).*$/gm)
        );
      });
    },
    async getEmbeddingsModels({ $ }) {
      const models = await this.models({
        $,
      });
      return models.filter((model) => {
        const { id } = model;
        return (
          id.match(/^(text-embedding-ada-002|.*-(davinci|curie|babbage|ada)-.*-001)$/gm)
        );
      });
    },
    async _makeCompletion({
      $, path, args,
    }) {
      const data = await this._makeRequest({
        $,
        path,
        method: "POST",
        data: args,
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
    async createCompletion({
      $, args,
    }) {
      return this._makeCompletion({
        $,
        path: "/completions",
        args,
      });
    },
    async createChatCompletion({
      $, args,
    }) {
      return this._makeCompletion({
        $,
        path: "/chat/completions",
        args,
      });
    },
    async createImage({
      $, args,
    }) {
      return this._makeRequest({
        $,
        path: "/images/generations",
        data: args,
        method: "POST",
      });
    },
    async createEmbeddings({
      $, args,
    }) {
      return this._makeRequest({
        $,
        path: "/embeddings",
        data: args,
        method: "POST",
      });
    },
    async createTranscription({
      $, form,
    }) {
      return this._makeRequest({
        $,
        path: "/audio/transcriptions",
        method: "POST",
        headers: {
          ...this._commonHeaders(),
          "Content-Type": `multipart/form-data; boundary=${form._boundary}`,
        },
        data: form,
      });
    },
  },
};
