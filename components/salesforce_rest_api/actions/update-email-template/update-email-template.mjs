// x-pd-ai: optimized
import salesforce from "../../salesforce_rest_api.app.mjs";

export default {
  key: "salesforce_rest_api-update-email-template",
  name: "Update Email Template",
  description: "Update an existing Salesforce email template."
    + " Use **List Email Templates** to find the template ID first."
    + " Only the fields you supply change; everything else is left as-is."
    + " "
    + "[See the documentation](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/dome_update_fields.htm)",
  version: "0.0.7",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    salesforce,
    recordId: {
      type: "string",
      label: "Record ID",
      description: "The ID of the EmailTemplate record to update. Use **SOQL Query** to find the ID.",
    },
    fields: {
      type: "object",
      label: "Fields",
      description:
        "Field name -> new value pairs. Example: `{\"Subject\": \"Updated subject line\", \"Body\": \"New body content\"}`. Use **Describe Object** to discover valid field names.",
    },
  },
  async run({ $ }) {
    const response = await this.salesforce.updateRecord("EmailTemplate", {
      $,
      id: this.recordId,
      data: this.fields,
    });
    $.export("$summary", `Successfully updated Email Template record (ID: ${this.recordId})`);
    return response;
  },
};
