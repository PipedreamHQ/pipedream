import google_appsheet from "../../google_appsheet.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "google_appsheet-delete-row",
  name: "Delete Row",
  description: "Deletes a specific row from a table in an AppSheet app. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    google_appsheet: {
      type: "app",
      app: "google_appsheet",
    },
    rowId: {
      type: "string",
      label: "Row ID",
      description: "The ID of the row to delete",
    },
  },
  async run({ $ }) {
    const response = await this.google_appsheet.deleteRow(this.rowId);
    $.export("$summary", `Deleted row with ID ${this.rowId}`);
    return response;
  },
};
