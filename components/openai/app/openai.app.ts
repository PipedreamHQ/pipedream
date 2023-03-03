import { defineApp } from "@pipedream/types";
import {
  Configuration, OpenAIApi,
} from "openai";

export default defineApp({
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
    _client(): OpenAIApi {
      const configuration = new Configuration({
        apiKey: this._apiKey(),
      });
      return new OpenAIApi(configuration);
    },
    async getModels() {
      return this._client().listModels();
    },
    async sendPrompt(args = {}) {
      return this._client().createCompletion(args);
    },
    async createImage(args = {}) {
      return this._client().createImage(args);
    },
  },
});
