import { parseRowIds } from "../../common/utils.mjs";
import smartsheet from "../../smartsheet.app.mjs";

export default {
  key: "smartsheet-delete-rows",
  name: "Delete Rows",
  description:
    "Delete one or more rows from a sheet by row ID. This is permanent and cannot be undone."
    + " Use **Get Sheet** or **Search** to find row IDs first."
    + " [See the documentation](https://developers.smartsheet.com/api/smartsheet/openapi/rows/delete-rows)",
  version: "0.1.0",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    smartsheet,
    sheetId: {
      propDefinition: [
        smartsheet,
        "sheetIdOrUrl",
      ],
    },
    rowIds: {
      type: "string",
      label: "Row IDs",
      description:
        "Comma-separated list of row IDs to delete, or a JSON array."
        + " Example: `1234567890, 9876543210` or `[1234567890, 9876543210]`."
        + " Use **Get Sheet** to find row IDs.",
    },
  },
  async run({ $ }) {
    const rowIds = parseRowIds(this.rowIds);
    const sheetId = await this.smartsheet.resolveSheetId(this.sheetId, {
      $,
    });
    const response = await this.smartsheet.deleteRows(sheetId, {
      $,
      params: {
        ids: rowIds.join(","),
      },
    });
    $.export("$summary", `Deleted ${rowIds.length} row(s) from sheet ${sheetId}`);
    return response;
  },
};
