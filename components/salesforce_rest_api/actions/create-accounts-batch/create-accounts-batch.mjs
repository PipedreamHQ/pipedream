import common from "../common/batch-operation.mjs";

export default {
  ...common,
  key: "salesforce_rest_api-create-accounts-batch",
  name: "Create Accounts (Batch)",
  description: "Create multiple Accounts in Salesforce using Bulk API 2.0. [See the documentation](https://developer.salesforce.com/docs/atlas.en-us.api_asynch.meta/api_asynch/datafiles_understanding_bulk2_ingest.htm)",
  version: "0.0.1",
  type: "action",
  methods: {
    ...common.methods,
    getObject() {
      return "Account";
    },
    getOperation() {
      return "insert";
    },
    getSummary() {
      return "Successfully created Accounts";
    },
  },
};
