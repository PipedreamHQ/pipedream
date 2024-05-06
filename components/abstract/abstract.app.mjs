import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "abstract",
  propDefinitions: {
    emailAddress: {
      type: "string",
      label: "Email Address",
      description: "The email address to validate.",
    },
    autoCorrect: {
      type: "boolean",
      label: "Auto Correct",
      description: "You can choose to disable auto correct. By default, it is turned on.",
      optional: true,
      default: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://emailvalidation.abstractapi.com";
    },
    _makeRequest({
      $, params, ...args
    }) {
      return axios($, {
        ...args,
        baseURL: this._baseUrl(),
        params: {
          ...params,
          api_key: this.$auth.email_validation_api_key,
        },
      });
    },
    async checkEmailDeliverability(args) {
      return this._makeRequest({
        method: "GET",
        url: "/v1",
        ...args,
      });
    },
  },
};
