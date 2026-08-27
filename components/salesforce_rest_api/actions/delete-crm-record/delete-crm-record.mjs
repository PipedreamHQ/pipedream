// x-pd-ai: optimized
import salesforce from "../../salesforce_rest_api.app.mjs";

export default {
  key: "salesforce_rest_api-delete-crm-record",
  name: "Delete CRM Record",
  description:
    "Delete a Salesforce record. This moves it to the Recycle Bin, where it stays recoverable for up to 15 days - storage limits can purge it sooner."
    + " Use **SOQL Query** to find the record ID if you only have the record name."
    + " "
    + "[See the documentation](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/dome_delete_record.htm)",
  version: "0.0.3",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
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
        "The ID of the record to delete."
        + " Use **SOQL Query** to find the ID if you only have the record name.",
    },
  },
  async run({ $ }) {
    await this.salesforce.deleteRecord({
      sobjectType: this.objectType,
      recordId: this.recordId,
      $,
    });

    $.export(
      "$summary",
      `Deleted ${this.objectType} ${this.recordId}`,
    );

    return {
      success: true,
      objectType: this.objectType,
      recordId: this.recordId,
      deleted: true,
    };
  },
};
