import { ConfigurationError } from "@pipedream/platform";
import smartsheet from "../../smartsheet.app.mjs";

function parseRowIds(raw) {
  let rowIds;
  try {
    const parsed = JSON.parse(raw);
    rowIds = Array.isArray(parsed)
      ? parsed
      : [
        parsed,
      ];
  } catch {
    rowIds = raw.split(",").map((id) => id.trim())
      .filter(Boolean);
  }
  const numeric = rowIds.map(Number);
  if (!numeric.length || numeric.some((id) => !Number.isFinite(id))) {
    throw new ConfigurationError("`Row IDs` must be a comma-separated list of numeric row IDs or a JSON array of numbers.");
  }
  return numeric;
}

export default {
  key: "smartsheet-move-rows",
  name: "Move Rows",
  description:
    "Move one or more rows from a source sheet to a destination sheet. WARNING: Rows are permanently removed from the source sheet."
    + " Cell values, formatting, and attachments are transferred. The destination sheet must have compatible columns."
    + " Use **Get Sheet** to find row IDs in the source sheet."
    + " To copy rows instead (keeping them in the source), use **Copy Rows**."
    + " [See the documentation](https://developers.smartsheet.com/api/smartsheet/openapi/rows/move-rows)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    smartsheet,
    sheetId: {
      type: "string",
      label: "Source Sheet ID",
      description: "The ID of the source sheet containing the rows. Use **List Sheets** to find sheet IDs.",
    },
    rowIds: {
      type: "string",
      label: "Row IDs",
      description:
        "Comma-separated list of row IDs to move, or a JSON array."
        + " Example: `1234567890, 9876543210` or `[1234567890, 9876543210]`."
        + " Use **Get Sheet** to find row IDs.",
    },
    destinationSheetId: {
      type: "string",
      label: "Destination Sheet ID",
      description: "The ID of the destination sheet to move rows into. Use **List Sheets** to find sheet IDs.",
    },
  },
  async run({ $ }) {
    const rowIds = parseRowIds(this.rowIds);
    const destinationSheetId = Number(this.destinationSheetId);
    if (!Number.isFinite(destinationSheetId)) {
      throw new ConfigurationError("`Destination Sheet ID` must be a numeric sheet ID.");
    }

    const response = await this.smartsheet.moveRows(this.sheetId, {
      $,
      data: {
        rowIds,
        to: {
          sheetId: destinationSheetId,
        },
      },
    });
    $.export("$summary", `Moved ${rowIds.length} row(s) from sheet ${this.sheetId} to sheet ${this.destinationSheetId}`);
    return response;
  },
};
