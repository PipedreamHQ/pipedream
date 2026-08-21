// x-pd-ai: optimized
import {
  convertFieldsToProps, getAdditionalFields,
} from "../../common/props-utils.mjs";
import salesforce from "../../salesforce_rest_api.app.mjs";

export default {
  key: "salesforce_rest_api-update-record",
  name: "Update Record",
  description: "Update a Salesforce record of any object type, choosing fields interactively."
    + " Prefer **Update CRM Record** in agent and API contexts - this action builds its field list dynamically, so the available inputs are not visible until an object type is chosen."
    + " Only the fields you supply change; everything else is left as-is."
    + " "
    + "[See the documentation](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/dome_update_fields.htm)",
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
