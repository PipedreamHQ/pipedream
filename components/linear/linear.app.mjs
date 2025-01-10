//import linearApp from "@pipedream/linear_app";
import linearApp from "../linear_app/linear_app.app.mjs";

// TODO: Will update above statement to import from @pipedream/linear_app
// after updates to linear_app are published

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
