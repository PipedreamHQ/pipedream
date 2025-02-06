import google_appsheet from "../../google_appsheet.app.mjs";

export default {
  key: "google_appsheet-update-row",
  name: "Update Row",
  description: "Updates an existing row in a specific table in an AppSheet app. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    google_appsheet,
    rowId: {
      type: "string",
      label: "Row ID",
      description: "The ID of the row to update",
    },
    fieldsToUpdate: {
      type: "object",
      label: "Fields to Update",
      description: "Key-value pairs of fields to update",
    },
  },
  async run({ $ }) {
    const response = await this.google_appsheet.updateRow(this.rowId, this.fieldsToUpdate);
    $.export("$summary", `Updated row with ID ${this.rowId}`);
    return response;
  },
};
