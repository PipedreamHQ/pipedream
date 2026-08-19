import { ConfigurationError } from "@pipedream/platform";
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
    const destinationType = this.destinationType || "home";
    if (destinationType !== "home" && !this.destinationId) {
      throw new ConfigurationError(`Destination ID is required when Destination Type is "${destinationType}".`);
    }
    if (destinationType === "home" && this.destinationId) {
      throw new ConfigurationError("Destination ID must be omitted when Destination Type is \"home\".");
    }

    const data = {
      destinationType,
    };
    if (this.newName) data.newName = this.newName;
    if (this.destinationId) {
      const destinationId = Number(this.destinationId);
      if (!Number.isFinite(destinationId)) {
        throw new ConfigurationError("`Destination ID` must be a numeric ID.");
      }
      data.destinationId = destinationId;
    }

    const response = await this.smartsheet.copySheet(this.sheetId, {
      $,
      data,
    });
    $.export("$summary", `Copied sheet to "${response.result.name}" (ID: ${response.result.id})`);
    return response;
  },
};
