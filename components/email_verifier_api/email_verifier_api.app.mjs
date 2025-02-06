import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "email_verifier_api",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://emailverifierapi.com/v2/";
    },
    _makeRequest({
      $ = this,
      params,
      ...opts
    }) {
      return axios($, {
        url: this._baseUrl(),
        params: {
          ...params,
          apiKey: this.$auth.api_key,
        },
        ...opts,
      });
    },
    verifyEmail({
      $, email,
    }) {
      return this._makeRequest({
        $,
        params: {
          email,
        },
      });
    },
  },
};
