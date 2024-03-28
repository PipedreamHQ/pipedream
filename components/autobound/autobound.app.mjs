import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "autobound",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://api.autobound.ai/api/external";
    },
    async _makeRequest({
      $ = this,
      headers,
      ...otherOpts
    }) {
      return axios($, {
        ...otherOpts,
        baseURL: this._baseUrl(),
        headers: {
          ...headers,
          "X-API-KEY": `${this.$auth.api_key}`,
        },
      });
    },
    async generateContent(args) {
      return this._makeRequest({
        url: "/generate-content/v3.1",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        ...args,
      });
    },
  },
};
