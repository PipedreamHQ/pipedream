import salesforce from "../../salesforce_rest_api.app.mjs";

export default {
  key: "salesforce_rest_api-delete-opportunity",
  name: "Delete Opportunity",
  description: "Deletes an opportunity. [See the documentation](https://developer.salesforce.com/docs/atlas.en-us.228.0.api_rest.meta/api_rest/dome_delete_record.htm)",
  version: "0.3.4",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    salesforce,
    recordId: {
      propDefinition: [
        salesforce,
        "recordId",
        () => ({
          objType: "Opportunity",
          nameField: "Name",
        }),
      ],
      label: "Opportunity ID",
      description: "ID of the opportunity to delete.",
    },
  },
  async run({ $ }) {
    const { recordId } = this;
    const response = await this.salesforce.deleteRecord({
      sobjectType: "Opportunity",
      $,
      recordId,
    });
    $.export("$summary", `Successfully deleted opportunity (ID: ${recordId})`);
    return response;
  },
};
