import linearApp from "@pipedream/linear_app";

export default {
  ...linearApp,
  app: "linear",
  methods: {
    ...linearApp.methods,
    getClientOptions(options = {}) {
      return {
        accessToken: this.$auth.oauth_access_token,
        ...options,
      };
    },
    getAxiosHeaders() {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
  },
};
