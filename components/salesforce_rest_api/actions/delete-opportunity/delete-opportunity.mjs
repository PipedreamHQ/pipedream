import salesforce from "../../salesforce_rest_api.app.mjs";
import { toSingleLineString } from "../../common/utils.mjs";

export default {
  key: "salesforce_rest_api-delete-opportunity",
  name: "Delete Opportunity",
  description: toSingleLineString(`
    Deletes an opportunity.
    See [Opportunity SObject](https://developer.salesforce.com/docs/atlas.en-us.228.0.object_reference.meta/object_reference/sforce_api_objects_opportunity.htm)
    and [Delete Record](https://developer.salesforce.com/docs/atlas.en-us.228.0.api_rest.meta/api_rest/dome_delete_record.htm)
  `),
  version: "0.2.5",
  type: "action",
  props: {
    salesforce,
    OpportunityId: {
      type: "string",
      label: "Opportunity ID",
      description: "ID of the Opportunity to delete",
    },
  },
  async run({ $ }) {
    const response = await this.salesforce.deleteOpportunity({
      $,
      id: this.OpportunityId,
    });
    $.export("$summary", "Successfully deleted opportunity");
    return response;
  },
};
