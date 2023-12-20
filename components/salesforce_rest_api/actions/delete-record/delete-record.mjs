import salesForceRestApi from "../../salesforce_rest_api.app.mjs";

export default {
  key: "salesforce_rest_api-delete-record",
  name: "Delete a Record in an Object",
  description:
    "Deletes an existing record in an object. [API Doc](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/dome_query.htm)",
  version: "0.1.3",
  type: "action",
  props: {
    salesForceRestApi,
    sobjectType: {
      propDefinition: [
        salesForceRestApi,
        "objectType",
      ],
    },
    sobjectId: {
      propDefinition: [
        salesForceRestApi,
        "sobjectId",
        (c) => ({
          objectType: c.sobjectType,
        }),
      ],
      description:
        "ID of the Salesforce standard object to get field values from.",
    },
  },
  async run({ $ }) {
    const {
      sobjectType,
      sobjectId,
    } = this;
    const response = await this.salesForceRestApi.deleteObject(
      sobjectType,
      sobjectId,
    );
    response && $.export("$summary", `Successfully deleted record with ID ${sobjectId}`);
    return response;
  },
};
