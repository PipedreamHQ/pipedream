import salesforce from "../../salesforce_rest_api.app.mjs";

export default {
  key: "salesforce_rest_api-update-record",
  name: "Update Record",
  description: "Update fields of a record. Only pass the fields you want to change. Use **SOQL Query** to find the record ID and **Describe Object** for valid field names. [See the documentation](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/dome_update_fields.htm)",
  version: "0.3.8",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    salesforce,
    sobjectType: {
      type: "string",
      label: "Object Type",
      description:
        "The Salesforce object API name to update (e.g. `Account`, `Contact`, `Opportunity`). Prop name preserved to avoid breaking existing configs.",
    },
    recordId: {
      type: "string",
      label: "Record ID",
      description:
        "The ID of the record to update. Use **SOQL Query** to find the ID if you only have the record name.",
    },
    fields: {
      type: "object",
      label: "Fields",
      description:
        "Field name -> new value pairs. Only include fields you want to change. Example: `{\"StageName\": \"Closed Won\", \"Amount\": 75000}`. Use **Describe Object** to discover valid field names.",
    },
  },
  async run({ $ }) {
    await this.salesforce.updateRecord(this.sobjectType, {
      $,
      id: this.recordId,
      data: this.fields,
    });
    $.export("$summary", `Successfully updated ${this.sobjectType} record (ID: ${this.recordId})`);
    return {
      success: true,
      objectType: this.sobjectType,
      recordId: this.recordId,
    };
  },
};
