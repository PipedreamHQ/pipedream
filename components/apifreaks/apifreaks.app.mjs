import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "apifreaks",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://api.apifreaks.com";
    },
    _headers() {
      return {
        "X-apiKey": `${this.$auth.api_key}`,
      };
    },
    async _makeRequest({
      $ = this, path, params = {}, ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        params: {
          ...params,
          // APIFreaks accepts the key via header and/or query param; send both
          // for maximum compatibility across endpoints.
          apiKey: `${this.$auth.api_key}`,
        },
        ...args,
      });
    },
  },
};
