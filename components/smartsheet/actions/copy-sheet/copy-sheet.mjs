import { DESTINATION_TYPES } from "../../common/constants.mjs";
import smartsheet from "../../smartsheet.app.mjs";

export default {
  key: "smartsheet-copy-sheet",
  name: "Copy Sheet",
  description:
    "Copy an existing sheet to a new location. Creates a complete duplicate including all rows, columns, formatting, and attachments."
    + " Specify a destination workspace or folder, or omit both to copy to the user's home (Sheets folder)."
    + " Returns the new sheet's ID and permalink."
    + " Use **List Sheets** to find the source sheet ID."
    + " To move a sheet instead (removing it from the original location), use **Move Sheet**."
    + " [See the documentation](https://developers.smartsheet.com/api/smartsheet/openapi/sheets/copy-sheet)",
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
      description: "The ID of the sheet to copy. Use **List Sheets** to find sheet IDs.",
    },
    newName: {
      type: "string",
      label: "New Name",
      description: "Name for the copied sheet. If omitted, Smartsheet appends 'Copy of' to the original name.",
      optional: true,
    },
    destinationType: {
      type: "string",
      label: "Destination Type",
      description: "Where to copy the sheet. Defaults to `home` if omitted.",
      options: DESTINATION_TYPES,
      optional: true,
    },
    destinationId: {
      type: "string",
      label: "Destination ID",
      description: "The ID of the destination workspace or folder. Required when Destination Type is `workspace` or `folder`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      destinationType: this.destinationType || "home",
    };
    if (this.newName) data.newName = this.newName;
    if (this.destinationId) data.destinationId = Number(this.destinationId);

    const response = await this.smartsheet.copySheet(this.sheetId, {
      $,
      data,
    });
    $.export("$summary", `Copied sheet to "${response.result.name}" (ID: ${response.result.id})`);
    return response;
  },
};
