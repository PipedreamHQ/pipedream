import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "alttext_ai",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://alttext.ai/api/v1";
    },
    async _makeRequest({
      $ = this,
      path,
      headers,
      ...otherOpts
    }) {
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "X-API-Key": `${this.$auth.api_key}`,
        },
      });
    },
    async generateAltText(args) {
      return this._makeRequest({
        path: "/images",
        method: "POST",
        ...args,
      });
    },
  },
};
