import salesforce from "../../salesforce_rest_api.app.mjs";

export default {
  key: "salesforce_rest_api-list-object-fields",
  name: "List Object Fields",
  description: "Lists all fields for a given object type. [See the documentation](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/dome_sobject_describe.htm)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    salesforce,
    sobjectType: {
      propDefinition: [
        salesforce,
        "objectType",
      ],
      description: "The type of object to list fields of",
    },
    customOnly: {
      type: "boolean",
      label: "Custom Only",
      description: "Set to `true` to only list custom fields",
      optional: true,
    },
  },
  async run({ $ }) {
    let response = await this.salesforce.getFieldsForObjectType(this.sobjectType);

    if (this.customOnly) {
      response = response.filter((field) => field.custom);
    }

    $.export("$summary", `Successfully listed fields for object type ${this.sobjectType}`);
    return response;
  },
};
