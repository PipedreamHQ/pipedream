import salesForceRestApi from "../../salesforce_rest_api.app.mjs";

export default {
  key: "salesforce_rest_api-find-records",
  name: "Get Object Records",
  description:
    "Retrieves all records in an object or a record in an object by the given ID or criteria. [API Doc](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/dome_get_field_values.htm)",
  version: "0.1.2",
  type: "action",
  props: {
    salesForceRestApi,
    sobjectType: {
      propDefinition: [
        salesForceRestApi,
        "objectType",
      ],
    },
    ids: {
      propDefinition: [
        salesForceRestApi,
        "sobjectId",
        (c) => ({
          objectType: c.sobjectType,
        }),
      ],
      type: "string[]",
    },
    fields: {
      type: "string[]",
      label: "Fields to get values from",
      description:
        "list of the Salesforce standard object's fields to get values from.",
    },
  },
  async run({ $ }) {
    const {
      sobjectType,
      fields,
      ids,
    } = this;
    const response = await this.salesForceRestApi.getRecords(
      sobjectType, {
        fields: Array.isArray(fields) && fields.join(",") || fields,
        ids: Array.isArray(ids) && ids.join(",") || ids,
      },
    );
    if (response) {
      $.export("$summary", "Record found successfully");
    }
    return response;
  },
};
