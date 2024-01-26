import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "retailed",
  propDefinitions: {
    apiKey: {
      type: "string",
      label: "API Key",
      description: "The API key for authenticating requests to the Retailed API.",
      secret: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.retailed.io/api/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, path, headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Content-Type": "application/json",
          "x-api-key": this.$auth.apiKey,
        },
      });
    },
    async getApiUsage() {
      return this._makeRequest({
        path: "/usage",
      });
    },
  },
};
