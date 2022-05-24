import salesForceRestApi from "../../salesforce_rest_api.app.mjs";

export default {
  key: "salesforce_rest_api-find-records",
  name: "Get Object Records",
  description:
    "Retrieves all records in an object or a record in an object by the given ID or criteria. [API Doc](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/dome_get_field_values.htm)",
  version: "0.1.0",
  type: "action",
  props: {
    salesForceRestApi,
    sobjectType: {
      type: "string",
      label: "Object type",
      description:
       "Salesforce standard object type of the record to get field values from. [Object types](https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_objects_list.htm)",
    },
    ids: {
      type: "string[]",
      label: "Record IDs to be returned",
      description:
        "Record IDs to be returned",
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
    const response =  await this.salesForceRestApi.getRecords(
      sobjectType, {
        fields: fields.join(","),
        ids: ids.join(","),
      },
    );
    $.export("$summary", "Record found successfully" );
    return response;
  },
};
