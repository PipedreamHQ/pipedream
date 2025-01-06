import common from "@pipedream/quickbooks";

export default {
  ...common,
  type: "app",
  app: "quickbooks_sandbox",
  methods: {
    ...common.methods,
    _apiUrl() {
      return "https://sandbox-quickbooks.api.intuit.com/v3";
    },
  },
};
