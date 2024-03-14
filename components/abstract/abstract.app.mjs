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
      description: "You can choose to disable auto correct. To do so, just input false for the auto_correct param. By default, auto_correct is turned on.",
      optional: true,
      default: true,
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://emailvalidation.abstractapi.com/v1";
    },
    async checkEmailDeliverability({
      emailAddress, autoCorrect,
    }) {
      return axios(this, {
        method: "GET",
        url: this._baseUrl(),
        params: {
          api_key: this.$auth.api_key,
          email: emailAddress,
          auto_correct: autoCorrect,
        },
      });
    },
  },
};
