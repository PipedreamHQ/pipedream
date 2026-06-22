import common from "@pipedream/snowflake";

export default {
  ...common,
  type: "app",
  app: "snowflake_oauth",
  methods: {
    ...common.methods,
    /**
     * Reuse the entire key-based Snowflake engine from @pipedream/snowflake and
     * override ONLY the auth.
     */
    getClientConfiguration() {
      const {
        snowflake_account_url: accountUrl,
        oauth_access_token: token,
      } = this.$auth;
      // The OAuth app collects a full account URL (e.g. https://<account>.snowflakecomputing.com),
      // not a bare account identifier. Derive the account locator the SDK expects from it.
      const account = new URL(accountUrl).hostname.replace(".snowflakecomputing.com", "");
      return {
        account,
        authenticator: "OAUTH",
        token,
        application: "PIPEDREAM_PIPEDREAM",
      };
    },
  },
};
