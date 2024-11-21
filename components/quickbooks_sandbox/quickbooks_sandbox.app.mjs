import common from "../quickbooks/quickbooks.app.mjs";

export default {
  ...common,
  type: "app",
  app: "quickbooks_sandbox",
  methods: {
    ...common.methods,
    _apiUrl() {
      return "https://quickbooks.api.intuit.com/v3";
    },
  },
};
