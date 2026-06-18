import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "apexverify",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://api.apexverify.com";
    },

    _headers() {
      return {
        "X-API-Key": this.$auth.api_key,
        Accept: "application/json",
      };
    },

    async _makeRequest($, {
      method = "GET",
      path,
      data,
      params,
      headers = {},
    }) {
      try {
        return await axios($, {
          method,
          url: `${this._baseUrl()}${path}`,
          headers: {
            ...this._headers(),
            ...headers,
          },
          data,
          params,
        });
      } catch (error) {
        const message =
          error?.response?.data?.message ||
          error?.message ||
          "ApexVerify API request failed.";

        throw new Error(message);
      }
    },

    async testConnection($) {
      return this._makeRequest($, {
        method: "GET",
        path: "/v1/account/credits",
      });
    },
  },
};