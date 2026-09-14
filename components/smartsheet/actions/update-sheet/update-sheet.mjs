import { ConfigurationError } from "@pipedream/platform";
import smartsheet from "../../smartsheet.app.mjs";

export default {
  key: "smartsheet-update-sheet",
  name: "Update Sheet",
  description:
    "Update a sheet's properties such as its name."
    + " Use **List Sheets** to find the sheet ID first."
    + " Example: `{sheetId: \"1234567890123456\", sheetName: \"Q1 Launch Tracker\"}` renames the sheet and returns"
    + " its updated name and ID."
    + " [See the documentation](https://developers.smartsheet.com/api/smartsheet/openapi/sheets/updatesheet)",
  version: "0.0.2",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    smartsheet,
    sheetId: {
      propDefinition: [
        smartsheet,
        "sheetId",
      ],
      description: "The ID of the sheet to update. Use **List Sheets** to find sheet IDs.",
    },
    sheetName: {
      type: "string",
      label: "New Name",
      description: "The new name for the sheet.",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      ...(this.sheetName
        ? {
          name: this.sheetName,
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
