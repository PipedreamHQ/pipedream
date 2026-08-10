// x-pd-ai: optimized
import common from "../common/batch-operation.mjs";

export default {
  ...common,
  key: "salesforce_rest_api-update-opportunities-batch",
  name: "Update Opportunities (Batch)",
  description: "Update many Salesforce opportunities in one job using Bulk API 2.0."
    + " Use this instead of **Update Opportunity** when updating more than roughly 200 records - it is asynchronous and returns a job ID, not the updated records."
    + " Every row must include the record `Id` of the opportunity to update."
    + " "
    + "[See the documentation](https://developer.salesforce.com/docs/atlas.en-us.api_asynch.meta/api_asynch/datafiles_understanding_bulk2_ingest.htm)",
  version: "0.0.6",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  methods: {
    ...common.methods,
    getObject() {
      return "Opportunity";
    },
    getOperation() {
      return "update";
    },
    getSummary() {
      return "Successfully updated Opportunities";
    },
  },
};
