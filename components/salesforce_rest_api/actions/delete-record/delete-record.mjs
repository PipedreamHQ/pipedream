import salesForceRestApi from "../../salesforce_rest_api.app.mjs";

export default {
  key: "salesforce_rest_api-delete-record",
  name: "Delete Record",
  description:
    "Deletes an existing record in an object. [See the documentation](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/resources_sobject_retrieve_delete.htm)",
  version: "0.2.{{ts}}",
  type: "action",
  props: {
    salesForceRestApi,
    sobjectType: {
      propDefinition: [
        salesForceRestApi,
        "objectType",
      ],
    },
    recordId: {
      propDefinition: [
        salesForceRestApi,
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
    const response = await this.salesForceRestApi.deleteObject({
      $,
      sobjectType,
      recordId,
    });
    $.export("$summary", `Successfully deleted record (ID: ${recordId})`);
    return response;
  },
};
