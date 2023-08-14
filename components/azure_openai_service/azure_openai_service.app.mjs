import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "azure_openai_service",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return `https://${this.$auth.resource_name}.openai.azure.com/openai/deployments/${this.$auth.deployment_name}`;
    },
    _apiVersion() {
      return "?api-version=2023-05-15";
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
        path: "/chat/completions",
        method: "POST",
        ...args,
      });
    },
  },
};
