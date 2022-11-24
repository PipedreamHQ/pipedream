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
      label: "Create As User/App",
      description: `Select who will appear as creating the issue on its history.
        \\
        See the [Linear docs](https://developers.linear.app/docs/oauth/oauth-actor-authorization) for more information.`,
      async options() {
        const { displayName } = await this.getOwnUserInfo();
        return [
          {
            label: displayName,
            value: "me",
          },
          {
            label: "[Custom Username]",
            value: "custom",
          },
          {
            label: "Pipedream",
            value: "app",
          },
        ];
      },
      default: "me",
      reloadProps: true,
    },
  },
};
