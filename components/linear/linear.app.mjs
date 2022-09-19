import linearApp from "../linear_app/linear_app.app.mjs";

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
  },
};
