// x-pd-ai: optimized
import { ConfigurationError } from "@pipedream/platform";
import smartsheet from "../../smartsheet.app.mjs";

export default {
  key: "smartsheet-update-sheet",
  name: "Update Sheet",
  description:
    "Rename an existing sheet, leaving its rows, columns, attachments, and sharing untouched."
    + " Only the properties you supply are changed, and at least one must be supplied."
    + " Returns the updated sheet under `result`."
    + " To change a sheet's location instead, use **Move Sheet**; to change its columns, use **Update Column**."
    + " Use **Search** or **List Sheets** to find the sheet ID first."
    + " [See the documentation](https://developers.smartsheet.com/api/smartsheet/openapi/sheets/updatesheet)",
  version: "0.0.3",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    smartsheet,
    sheetId: {
      type: "string",
      label: "Sheet ID",
      description: "The ID of the sheet to update (e.g. `1234567890123456`). Use **List Sheets** to find sheet IDs.",
    },
    name: {
      type: "string",
      label: "New Name",
      description: "The new name for the sheet.",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      ...(this.name
        ? {
          name: this.name,
        }
        : {}),
    };
    if (!Object.keys(data).length) {
      throw new ConfigurationError("Provide at least one property to update (e.g., New Name).");
    }
    const response = await this.smartsheet.updateSheetProperties(this.sheetId, {
      $,
      data,
    });
    $.export("$summary", `Updated sheet "${response.result?.name || this.sheetId}"`);
    return response;
  },
};
