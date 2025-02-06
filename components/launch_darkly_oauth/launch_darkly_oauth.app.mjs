import launchdarkly from "../launchdarkly/launchdarkly.app.mjs";

export default {
  ...launchdarkly,
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
