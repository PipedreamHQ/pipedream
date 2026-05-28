import smartsheet from "../../smartsheet.app.mjs";

export default {
  key: "smartsheet-update-sheet",
  name: "Update Sheet",
  description:
    "Update a sheet's properties such as its name."
    + " Use **List Sheets** to find the sheet ID first."
    + " [See the documentation](https://developers.smartsheet.com/api/smartsheet/openapi/sheets/updatesheet)",
  version: "0.0.1",
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
      description: "The ID of the sheet to update. Use **List Sheets** to find sheet IDs.",
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
    const response = await this.smartsheet.updateSheetProperties(this.sheetId, {
      $,
      data,
    });
    $.export("$summary", `Updated sheet ${this.sheetId}`);
    return response;
  },
};
