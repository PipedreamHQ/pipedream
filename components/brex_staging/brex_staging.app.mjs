import commonApp from "../brex/common-app.mjs";

export default {
  ...commonApp,
  type: "app",
  app: "brex_staging",
  methods: {
    ...commonApp.methods,
    _getBaseUrl() {
      return "https://platform.staging.brexapps.com";
    },
  },
};
