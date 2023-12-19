import salesforce from "../../salesforce_rest_api.app.mjs";
import { toSingleLineString } from "../../common/utils.mjs";

export default {
  key: "salesforce_rest_api-update-record",
  name: "Update Record",
  description: toSingleLineString(`
    Updates a record of a given resource.
    [See docs here](https://developer.salesforce.com/docs/atlas.en-us.228.0.api_rest.meta/api_rest/dome_update_fields.htm)
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
      description: "SObject Type of record to be updated",
    },
    sobjectId: {
      propDefinition: [
        salesforce,
        "sobjectId",
        (c) => ({
          objectType: c.objectType,
        }),
      ],
      description: "ID of the SObject record to be updated",
    },
    sobject: {
      type: "object",
      label: "SObject fields and values",
      description: "SObject record data to patch",
    },
  },
  async run({ $ }) {
    await this.salesforce.updateRecord(this.objectType, {
      $,
      id: this.sobjectId,
      data: this.sobject,
    });
    $.export("$summary", `Updated record ${this.objectType}`);
  },
};
