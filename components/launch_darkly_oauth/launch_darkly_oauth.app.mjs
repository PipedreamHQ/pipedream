import launchdarkly from "@pipedream/launchdarkly";

export default {
  ...launchdarkly,
  type: "app",
  app: "launch_darkly_oauth",
  methods: {
    ...launchdarkly.methods,
    getHeaders(headers) {
      return {
        "Content-Type": "application/json",
        ...headers,
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
  },
};
