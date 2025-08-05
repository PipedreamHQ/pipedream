import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "alttextlab",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://app.alttextlab.com/api/v1";
    },
    _headers(headers) {
      return {
        ...headers,
        "x-api-key": `${this.$auth.api_key}`,
      };
    },
    async _makeRequest({
      $ = this, path, headers, ...otherOptions
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(headers),
        ...otherOptions,
      });
    },
    async altTextGeneration(args) {
      return this._makeRequest({
        path: "/alt-text/generate",
        method: "POST",
        ...args,
      });
    },
  },
};
