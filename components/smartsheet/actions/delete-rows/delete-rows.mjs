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
  key: "smartsheet-delete-rows",
  name: "Delete Rows",
  description:
    "Delete one or more rows from a sheet by row ID. This is permanent and cannot be undone."
    + " Use **Get Sheet** or **Search** to find row IDs first."
    + " [See the documentation](https://developers.smartsheet.com/api/smartsheet/openapi/rows/delete-rows)",
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
      label: "Sheet ID",
      description: "The ID of the sheet containing the rows. Use **List Sheets** to find sheet IDs.",
    },
    rowIds: {
      type: "string",
      label: "Row IDs",
      description: "Comma-separated list of row IDs to delete. Example: `1234567890, 9876543210`. Use **Get Sheet** to find row IDs.",
    },
  },
  async run({ $ }) {
    const rowIds = parseRowIds(this.rowIds);
    const response = await this.smartsheet.deleteRows(this.sheetId, {
      $,
      params: {
        ids: rowIds.join(","),
      },
    });
    $.export("$summary", `Deleted ${rowIds.length} row(s) from sheet ${this.sheetId}`);
    return response;
  },
};
