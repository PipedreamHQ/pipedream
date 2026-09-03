// x-pd-ai: optimized
import { ConfigurationError } from "@pipedream/platform";
import { DESTINATION_TYPES } from "../../common/constants.mjs";
import { toIdString } from "../../common/utils.mjs";
import smartsheet from "../../smartsheet.app.mjs";

export default {
  key: "smartsheet-move-sheet",
  name: "Move Sheet",
  description:
    "Move a sheet to a different workspace, folder, or home. The sheet is removed from its current location."
    + " Use **List Sheets** to find the sheet ID."
    + " To copy a sheet instead (keeping the original), use **Copy Sheet**."
    + " [See the documentation](https://developers.smartsheet.com/api/smartsheet/openapi/sheets/move-sheet)",
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
      description: "The ID of the sheet to move (e.g. `1234567890123456`). Use **List Sheets** to find sheet IDs.",
    },
    destinationType: {
      type: "string",
      label: "Destination Type",
      description: "Where to move the sheet. Required by the API. `home` has been deprecated since 2025-03-25 and will be removed - move to a `workspace` or `folder` instead.",
      options: DESTINATION_TYPES,
    },
    destinationId: {
      type: "string",
      label: "Destination ID",
      description: "The numeric ID of the destination workspace or folder (e.g. `1234567890123456`). Required when Destination Type is `workspace` or `folder`, and not needed for `home`. Use **List Workspace Options** for workspace IDs or **List Folder Options** for folder IDs.",
      optional: true,
    },
  },
  async run({ $ }) {
    if (this.destinationType !== "home" && !this.destinationId) {
      throw new ConfigurationError(`Destination ID is required when Destination Type is "${this.destinationType}".`);
    }
    if (this.destinationType === "home" && this.destinationId) {
      throw new ConfigurationError("Destination ID must be omitted when Destination Type is \"home\".");
    }

    const data = {
      destinationType: this.destinationType,
    };
    if (this.destinationId) {
      data.destinationId = toIdString(this.destinationId, "Destination ID");
    }

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
