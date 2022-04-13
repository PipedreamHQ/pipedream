import salesforce from "../../salesforce_rest_api.app.mjs";
import { toSingleLineString } from "../../common/utils.mjs";

export default {
  key: "salesforce_rest_api-salesforce-create-record",
  name: "Create Record",
  description: toSingleLineString(`
    Create new records of a given resource.
    See [docs](https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_objects_list.htm)
  `),
  version: "0.2.2",
  type: "action",
  props: {
    salesforce,
    objectType: {
      propDefinition: [
        salesforce,
        "objectType",
      ],
      description: "SObject Type for this record",
    },
    sobject: {
      type: "object",
      label: "SObject fields and values",
      description: "Data of the SObject record to create",
    },
  },
  async run({ $ }) {
    const response = await this.salesforce.createRecord(this.objectType, {
      $,
      data: this.sobject,
    });
    $.export("$summary", `Created record "${this.objectType}"`);
    return response;
  },
};
