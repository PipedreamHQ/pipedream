import { DESTINATION_TYPES } from "../../common/constants.mjs";
import smartsheet from "../../smartsheet.app.mjs";

export default {
  key: "smartsheet-move-sheet",
  name: "Move Sheet",
  description:
    "Move a sheet to a different workspace, folder, or home. The sheet is removed from its current location."
    + " As of 2025-12-23, `destinationType` is required."
    + " Use **List Sheets** to find the sheet ID."
    + " To copy a sheet instead (keeping the original), use **Copy Sheet**."
    + " [See the documentation](https://developers.smartsheet.com/api/smartsheet/openapi/sheets/move-sheet)",
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
      description: "The ID of the sheet to move. Use **List Sheets** to find sheet IDs.",
    },
    destinationType: {
      type: "string",
      label: "Destination Type",
      description: "Where to move the sheet. Required.",
      options: DESTINATION_TYPES,
    },
    destinationId: {
      type: "string",
      label: "Destination ID",
      description: "The ID of the destination workspace or folder. Required when Destination Type is `workspace` or `folder`. Not needed for `home`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      destinationType: this.destinationType,
      ...(this.destinationId ? { destinationId: Number(this.destinationId) } : {}),
    };

    const response = await this.smartsheet.moveSheet(this.sheetId, {
      $,
      data,
    });
    $.export("$summary", `Moved sheet ${this.sheetId} to ${this.destinationType}${this.destinationId
      ? ` ${this.destinationId}`
      : ""}`);
    return response;
  },
};
