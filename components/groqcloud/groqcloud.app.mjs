import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "groqcloud",
  propDefinitions: {
    name: {
      type: "string",
      label: "Name",
      description: "An optional name for the participant. Provides the model information to differentiate between participants of the same role",
      optional: true,
    },
    content: {
      type: "string",
      label: "Content",
      description: "The contents of the message",
    },
    role: {
      type: "string",
      label: "Author Role",
      description: "The role of the message's author",
      options: constants.ROLES,
    },
    model: {
      type: "string",
      label: "Model",
      description: "ID of the model to use",
      async options() {
        const response = await this.getModels({});
        const modelsIDs = response.data;
        return modelsIDs.map(({ id }) => id);
      },
    },
    seed: {
      type: "integer",
      label: "Seed",
      description: "If specified, repeated requests with the same seed and parameters will return the same result",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.groq.com/openai/v1";
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
    async createChatCompletion(args = {}) {
      return this._makeRequest({
        method: "post",
        path: "/chat/completions",
        ...args,
      });
    },
    async getModels(args = {}) {
      return this._makeRequest({
        path: "/models",
        ...args,
      });
    },
  },
};
