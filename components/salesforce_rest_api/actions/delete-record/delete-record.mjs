import salesforce from "../../salesforce_rest_api.app.mjs";

export default {
  key: "salesforce_rest_api-delete-record",
  name: "Delete Record",
  description:
    "Deletes an existing record in an object. [See the documentation](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/resources_sobject_retrieve_delete.htm)",
  version: "0.2.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    salesforce,
    sobjectType: {
      propDefinition: [
        salesforce,
        "objectType",
      ],
      description: "The type of object to delete a record of.",
    },
    recordId: {
      propDefinition: [
        salesforce,
        "recordId",
        (c) => ({
          objType: c.sobjectType,
        }),
      ],
      description:
        "The record to delete.",
    },
  },
  async run({ $ }) {
    const {
      sobjectType,
      recordId,
    } = this;
    const response = await this.salesforce.deleteRecord({
      $,
      sobjectType,
      recordId,
    });
    $.export("$summary", `Successfully deleted record (ID: ${recordId})`);
    return response;
  },
};
