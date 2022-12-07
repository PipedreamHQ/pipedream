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
    async getOwnUserInfo() {
      const {
        avatarUrl, displayName,
      } = await this.client().viewer;
      return {
        avatarUrl,
        displayName,
      };
    },
  },
  propDefinitions: {
    ...linearApp.propDefinitions,
    createAs: {
      type: "string",
      label: "Create as",
      description: "Specify to whom who you'd like to attribute the issue creation (the signed-in user vs a custom username). See the [Linear docs](https://developers.linear.app/docs/oauth/oauth-actor-authorization) for more information.",
      async options() {
        const { displayName } = await this.getOwnUserInfo();
        return [
          {
            label: displayName,
            value: "me",
          },
          {
            label: "Custom Username",
            value: "custom",
          },
          {
            label: "Pipedream",
            value: "app",
          },
        ];
      },
      optional: true,
      default: "me",
      reloadProps: true,
    },
  },
};
