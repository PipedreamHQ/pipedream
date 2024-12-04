import common from "../quickbooks/quickbooks.app.mjs";

export default {
  type: "app",
  app: "quickbooks_sandbox",
  methods: {
    ...common.methods,
    _apiUrl() {
      return "https://sandbox-quickbooks.api.intuit.com/v3";
    },
  },
};
