import salesforce from "../../salesforce_rest_api.app.mjs";
import { toSingleLineString } from "../../common/utils.mjs";

export default {
  key: "salesforce_rest_api-get-sobject-fields-values",
  name: "Get Field Values from a Standard Object Record",
  description: toSingleLineString(`
    Retrieve field values from a record. You can specify the fields you want to retrieve.
    See [docs](https://developer.salesforce.com/docs/atlas.en-us.228.0.api_rest.meta/api_rest/dome_get_field_values.htm)
  `),
  version: "0.2.5",
  type: "action",
  props: {
    salesforce,
    objectType: {
      propDefinition: [
        salesforce,
        "objectType",
      ],
    },
    sobjectId: {
      propDefinition: [
        salesforce,
        "sobjectId",
        (c) => ({
          objectType: c.objectType,
        }),
      ],
    },
    fields: {
      type: "string[]",
      label: "SObject Fields",
      description: "List of fields of the Standard object to get values from",
      propDefinition: [
        salesforce,
        "field",
        (c) => ({
          objectType: c.objectType,
        }),
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {};
    if (this.fields?.length > 0) {
      params.fields = this.fields.join(",");
    }
    const response = await this.salesforce.getRecordFieldValues(this.objectType, {
      $,
      id: this.sobjectId,
      params,
    });
    $.export("$summary", `Retrieved ${this.objectType} field values`);
    return response;
  },
};
