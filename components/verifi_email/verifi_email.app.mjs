import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "verifi_email",
  propDefinitions: {},
  methods: {
    validateEmailAddress({
      $ = this, params, ...opts
    }) {
      return axios($, {
        url: "https://api.verifi.email/check",
        params: {
          ...params,
          token: this.$auth.api_key,
        },
        ...opts,
      });
    },
  },
};
