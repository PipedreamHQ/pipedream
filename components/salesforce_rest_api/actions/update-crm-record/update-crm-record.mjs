import salesforce from "../../salesforce_rest_api.app.mjs";

export default {
  key: "salesforce_rest_api-update-crm-record",
  name: "Update Record",
  description:
    "Update an existing Salesforce record. Only pass fields you want to change — unspecified fields remain unchanged."
    + " Use **Describe Object** for valid field names and picklist values."
    + " Use **SOQL Query** to find the record ID if you only have the name.",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    salesforce,
    objectType: {
      type: "string",
      label: "Object Type",
      description:
        "The Salesforce object API name (e.g. `Account`, `Contact`, `Opportunity`).",
    },
    recordId: {
      type: "string",
      label: "Record ID",
      description:
        "The ID of the record to update."
        + " Use **SOQL Query** to find the ID if you only have the record name.",
    },
    properties: {
      type: "object",
      label: "Properties to Update",
      description:
        "Field name → new value pairs. Only include fields you want to change."
        + " Example: `{\"StageName\": \"Closed Won\", \"Amount\": 75000}`."
        + " Use **Describe Object** to discover valid field names and picklist values.",
    },
  },
  async run({ $ }) {
    await this.salesforce.updateRecord(this.objectType, {
      $,
      id: this.recordId,
      data: this.properties,
    });

    $.export(
      "$summary",
      `Updated ${this.objectType} ${this.recordId}`,
    );

    return {
      success: true,
      objectType: this.objectType,
      recordId: this.recordId,
    };
  },
};
