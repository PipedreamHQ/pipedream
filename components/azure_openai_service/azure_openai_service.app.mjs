import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "azure_openai_service",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return `https://${this.$auth.resource_name}.openai.azure.com/openai/`;
    },
    _apiVersion() {
      return "?api-version=2023-06-01-preview";
    },
    _headers() {
      return {
        "api-key": `${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this,
      path,
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}${this._apiVersion()}`,
        headers: this._headers(),
        ...args,
      });
    },
    createChatCompletion(args = {}) {
      return this._makeRequest({
        path: `/deployments/${this.$auth.deployment_name}/chat/completions`,
        method: "POST",
        ...args,
      });
    },
    createImage(args = {}) {
      return this._makeRequest({
        path: "/images/generations:submit",
        method: "POST",
        ...args,
      });
    },
    getImageResult({
      operationId, ...args
    }) {
      return this._makeRequest({
        path: `/operations/images/${operationId}`,
        ...args,
      });
    },
  },
};
