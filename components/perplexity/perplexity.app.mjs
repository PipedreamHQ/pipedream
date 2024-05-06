import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "perplexity",
  propDefinitions: {
    model: {
      type: "string",
      label: "Model",
      description: "The name of the model that will complete your prompt",
      options: constants.MODELS,
    },
    content: {
      type: "string",
      label: "Content",
      description: "The contents of the message in this turn of conversation",
    },
    role: {
      type: "string",
      label: "Role",
      description: "The role of the speaker in this turn of conversation. After the (optional) system message, user and assistant roles should alternate with 'user' then 'assistant', ending in 'user'.",
      options: constants.ROLES,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.perplexity.ai";
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
    async chatCompletions(args = {}) {
      return this._makeRequest({
        method: "post",
        path: "/chat/completions",
        ...args,
      });
    },
  },
};
