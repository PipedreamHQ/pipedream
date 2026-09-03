// x-pd-ai: optimized
import { ROW_COPY_INCLUDE_OPTIONS } from "../../common/constants.mjs";
import {
  parseRowIds, toIdString,
} from "../../common/utils.mjs";
import smartsheet from "../../smartsheet.app.mjs";

export default {
  key: "smartsheet-copy-rows",
  name: "Copy Rows",
  description:
    "Copy rows from one sheet to another. The rows stay in the source sheet and are duplicated in the destination. Cell values and formatting always come across; attachments and comments only if you ask for them via Include. Columns the destination sheet is missing are created automatically, so it does not have to match the source first. Returns `rowMappings` pairing each source row ID with its new ID in the destination. To move rows instead, removing them from the source, use **Move Rows**."
    + " [See the documentation](https://developers.smartsheet.com/api/smartsheet/openapi/rows/copy-rows)",
  version: "0.1.1",
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
      description: "The numeric ID of the destination sheet to copy rows into (e.g. `1234567890123456`). Use **Search** or **List Sheets** to find sheet IDs.",
    },
    include: {
      type: "string[]",
      label: "Include",
      description: "Extra elements to carry across. Without this, only cell values and formatting are copied - attachments and comments are not.",
      options: ROW_COPY_INCLUDE_OPTIONS,
      optional: true,
    },
    ignoreRowsNotFound: {
      type: "boolean",
      label: "Ignore Rows Not Found",
      description: "`true` to skip row IDs that do not exist in the source sheet. Default `false`, which fails the whole call with a 404 if any ID is missing.",
      optional: true,
    },
  },
  async run({ $ }) {
    const rowIds = parseRowIds(this.rowIds);
    const destinationSheetId = toIdString(this.destinationSheetId, "Destination Sheet ID");

    const response = await this.smartsheet.copyRows(this.sheetId, {
      $,
      params: {
        include: this.include?.length
          ? this.include.join(",")
          : undefined,
        ignoreRowsNotFound: this.ignoreRowsNotFound,
      },
      data: {
        rowIds,
        to: {
          sheetId: destinationSheetId,
        },
      },
    });
    // Report what the API actually copied, not what was asked for: with Ignore Rows Not
    // Found, missing IDs are skipped and the input count overstates the result.
    const copied = response.rowMappings?.length ?? rowIds.length;
    $.export("$summary", `Copied ${copied} of ${rowIds.length} row(s) from sheet ${this.sheetId} to sheet ${destinationSheetId}`);
    return response;
  },
};
