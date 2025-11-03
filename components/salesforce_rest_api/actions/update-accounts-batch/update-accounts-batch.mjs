import common from "../common/batch-operation.mjs";

export default {
  ...common,
  key: "salesforce_rest_api-update-accounts-batch",
  name: "Update Accounts (Batch)",
  description: "Update multiple Accounts in Salesforce using Bulk API 2.0. [See the documentation](https://developer.salesforce.com/docs/atlas.en-us.api_asynch.meta/api_asynch/datafiles_understanding_bulk2_ingest.htm)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  methods: {
    ...common.methods,
    getObject() {
      return "Account";
    },
    getOperation() {
      return "update";
    },
    getSummary() {
      return "Successfully updated Accounts";
    },
  },
};
