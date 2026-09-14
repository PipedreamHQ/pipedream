import { ConfigurationError } from "@pipedream/platform";
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
    + " Example: `{sheetId: \"1234567890123456\", destinationType: \"folder\", destinationId: \"9876543210987654\"}`"
    + " moves the sheet into that folder and returns its updated permalink."
    + " [See the documentation](https://developers.smartsheet.com/api/smartsheet/openapi/sheets/move-sheet)",
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
      description: "The ID of the sheet to move. Use **List Sheets** to find sheet IDs.",
    },
    destinationType: {
      type: "string",
      label: "Destination Type",
      description: "Where to move the sheet. Required.",
      options: DESTINATION_TYPES,
    },
    destinationId: {
      propDefinition: [
        smartsheet,
        "destinationId",
      ],
      description: "The ID of the destination workspace or folder. Required when Destination Type is `workspace` or `folder`. Not needed for `home`."
        + " Use **List Workspace Options** or **List Folder Options** to find the relevant ID.",
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
      const destinationId = Number(this.destinationId);
      if (!Number.isFinite(destinationId)) {
        throw new ConfigurationError("`Destination ID` must be a numeric ID.");
      }
      data.destinationId = destinationId;
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
