import propsAsyncOptions from "../../common/props-async-options.mjs";
import salesforce from "../../salesforce_rest_api.app.mjs";

export default {
  key: "salesforce_rest_api-delete-opportunity",
  name: "Delete Opportunity",
  description: "Deletes an opportunity. [See the documentation](https://developer.salesforce.com/docs/atlas.en-us.228.0.api_rest.meta/api_rest/dome_delete_record.htm)",
  version: "0.3.{{ts}}",
  type: "action",
  props: {
    salesforce,
    opportunityId: {
      ...propsAsyncOptions.OpportunityId,
      description: "ID of the opportunity to delete.",
      async options() {
        return this.salesforce.listRecordOptions({
          objType: "Opportunity",
        });
      },
    },
  },
  async run({ $ }) {
    const response = await this.salesforce.deleteOpportunity({
      $,
      id: this.opportunityId,
    });
    $.export("$summary", `Successfully deleted opportunity (ID: ${this.opportunityId})`);
    return response;
  },
};
