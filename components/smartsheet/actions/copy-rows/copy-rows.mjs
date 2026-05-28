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
  key: "smartsheet-copy-rows",
  name: "Copy Rows",
  description:
    "Copy one or more rows from a source sheet to a destination sheet. The rows remain in the source sheet and are duplicated in the destination."
    + " Cell values, formatting, and attachments are copied. The destination sheet must have compatible columns."
    + " Use **Get Sheet** to find row IDs in the source sheet."
    + " To move rows instead (removing them from the source), use **Move Rows**."
    + " [See the documentation](https://developers.smartsheet.com/api/smartsheet/openapi/rows/copy-rows)",
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
      label: "Source Sheet ID",
      description: "The ID of the source sheet containing the rows. Use **List Sheets** to find sheet IDs.",
    },
    rowIds: {
      type: "string",
      label: "Row IDs",
      description:
        "Comma-separated list of row IDs to copy, or a JSON array."
        + " Example: `1234567890, 9876543210` or `[1234567890, 9876543210]`."
        + " Use **Get Sheet** to find row IDs.",
    },
    destinationSheetId: {
      type: "string",
      label: "Destination Sheet ID",
      description: "The ID of the destination sheet to copy rows into. Use **List Sheets** to find sheet IDs.",
    },
  },
  async run({ $ }) {
    const rowIds = parseRowIds(this.rowIds);
    const destinationSheetId = Number(this.destinationSheetId);
    if (!Number.isFinite(destinationSheetId)) {
      throw new ConfigurationError("`Destination Sheet ID` must be a numeric sheet ID.");
    }

    const response = await this.smartsheet.copyRows(this.sheetId, {
      $,
      data: {
        rowIds,
        to: {
          sheetId: destinationSheetId,
        },
      },
    });
    $.export("$summary", `Copied ${rowIds.length} row(s) from sheet ${this.sheetId} to sheet ${this.destinationSheetId}`);
    return response;
  },
};
