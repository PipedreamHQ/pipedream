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
  propDefinitions: {
    ...linearApp.propDefinitions,
    createAsUser: {
      type: "boolean",
      label: "Create As User",
      description: `If **true**, perform this action as the application.
        \\
        If **false**, you can specify the user that is performing this action.`,
      optional: true,
      default: true,
      reloadProps: true,
    },
  },
};
