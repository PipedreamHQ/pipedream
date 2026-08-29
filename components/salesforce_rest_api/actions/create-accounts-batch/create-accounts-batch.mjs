// x-pd-ai: optimized
import common from "../common/batch-operation.mjs";

export default {
  ...common,
  key: "salesforce_rest_api-create-accounts-batch",
  name: "Create Accounts (Batch)",
  description: "Create many Salesforce accounts in one job using Bulk API 2.0."
    + " Use this instead of **Create Account** when inserting more than roughly 200 records - it is asynchronous and returns a job ID, not the created records."
    + " Poll the job in Salesforce to confirm completion; a successful response means the job was accepted, not that every row loaded."
    + " Input is a CSV file - supply a path under `/tmp` or a URL to download it from, with a header row of Salesforce field API names."
    + " "
    + "[See the documentation](https://developer.salesforce.com/docs/atlas.en-us.api_asynch.meta/api_asynch/datafiles_understanding_bulk2_ingest.htm)",
  version: "0.0.7",
  annotations: {
    destructiveHint: false,
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
      return "insert";
    },
    getSummary() {
      return "Successfully created Accounts";
    },
  },
};
