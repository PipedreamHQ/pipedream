import { ROW_MOVE_INCLUDE_OPTIONS } from "../../common/constants.mjs";
import { parseRowIds } from "../../common/utils.mjs";
import smartsheet from "../../smartsheet.app.mjs";

export default {
  key: "smartsheet-move-rows",
  name: "Move Rows",
  description:
    "Move rows from one sheet to another. WARNING: the rows are permanently removed from the source sheet. Cell values and formatting always come across; attachments and comments only if you ask for them via Include. Columns the destination sheet is missing are created automatically, so it does not have to match the source first. Returns `rowMappings` pairing each source row ID with its new ID in the destination. To keep the originals, use **Copy Rows**."
    + " [See the documentation](https://developers.smartsheet.com/api/smartsheet/openapi/rows/move-rows)",
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
      label: "Source Sheet ID or URL",
      description: "The sheet the rows are moved out of. Accepts a numeric sheet ID (e.g. `1234567890123456`), or a Smartsheet sheet URL, which is resolved to the ID for you. Use **List Sheets** to enumerate sheets, or **Search** to find one by name.",
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
      propDefinition: [
        smartsheet,
        "sheetIdOrUrl",
      ],
      label: "Destination Sheet ID or URL",
      description: "The sheet the rows are moved into. Accepts a numeric sheet ID (e.g. `1234567890123456`), or a Smartsheet sheet URL, which is resolved to the ID for you. Use **List Sheets** to enumerate sheets, or **Search** to find one by name.",
    },
    include: {
      type: "string[]",
      label: "Include",
      description: "Extra elements to carry across. Without this, only cell values and formatting are moved; attachments and comments are not. Move Rows supports only `attachments` and `discussions` - the `children` and `all` values that **Copy Rows** accepts are not available for this endpoint.",
      options: ROW_MOVE_INCLUDE_OPTIONS,
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
    const destinationSheetId = await this.smartsheet.resolveSheetId(this.destinationSheetId, {
      $,
    });

    const sheetId = await this.smartsheet.resolveSheetId(this.sheetId, {
      $,
    });
    const response = await this.smartsheet.moveRows(sheetId, {
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
    // Report what was moved: Ignore Rows Not Found skips missing IDs.
    const moved = response.rowMappings?.length ?? rowIds.length;
    $.export("$summary", `Moved ${moved} of ${rowIds.length} row(s) from sheet ${sheetId} to sheet ${destinationSheetId}`);
    return response;
  },
};
