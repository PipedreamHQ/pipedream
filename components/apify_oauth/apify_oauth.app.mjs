import common from "@pipedream/apify";

export default {
  type: "app",
  app: "apify_oauth",
  propDefinitions: {
    ...common.propDefinitions,
  },
  methods: {
    ...common.methods,
    _headers() {
      return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        "x-apify-integration-platform": "pipedream",
      };
    },
  },
};
