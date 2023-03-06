import {
  Configuration, OpenAIApi,
} from "openai";

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
    _client() {
      const configuration = new Configuration({
        apiKey: this._apiKey(),
      });
      return new OpenAIApi(configuration);
    },
    async getModels(args = {}) {
      return this._client().listModels(args);
    },
    async sendPrompt(args = {}) {
      return this._client().createCompletion(args);
    },
    async createImage(args = {}) {
      return this._client().createImage(args);
    },
    async createChatCompletion(args = {}) {
      return this._client().createChatCompletion(args);
    },
  },
};
