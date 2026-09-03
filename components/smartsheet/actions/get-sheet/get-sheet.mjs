// x-pd-ai: optimized
import {
  SHEET_EXCLUDE_OPTIONS, SHEET_INCLUDE_OPTIONS,
} from "../../common/constants.mjs";
import smartsheet from "../../smartsheet.app.mjs";

export default {
  key: "smartsheet-get-sheet",
  name: "Get Sheet",
  description:
    "Get a sheet's full structure: column definitions (name, type, options, ID), all rows with cell values, and sheet metadata."
    + " This is the primary schema discovery tool - call it BEFORE **Add Row to Sheet** or **Update Row** to learn column names, types, and IDs."
    + " Returns rows with cell values keyed by column name for readability."
    + " For a lightweight column-only view, use **List Columns** instead."
    + " [See the documentation](https://developers.smartsheet.com/api/smartsheet/openapi/sheets/getsheet)",
  version: "1.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    smartsheet,
    sheetId: {
      type: "string",
      label: "Sheet ID or URL",
      description: "The numeric ID of the sheet to retrieve (e.g. `1234567890123456`), or a Smartsheet sheet URL (e.g. `https://app.smartsheet.com/sheets/abc123`), which is resolved to the ID for you. Use **Search** to find a sheet by name, or **List Sheets** to enumerate them.",
    },
    rowIds: {
      type: "string",
      label: "Row IDs",
      description: "Comma-separated row IDs to return (e.g. `1234567890,9876543210`). Far cheaper than fetching the whole sheet when you already know the rows. Use **Search** to find row IDs.",
      optional: true,
    },
    rowNumbers: {
      type: "string",
      label: "Row Numbers",
      description: "Comma-separated row positions to return (e.g. `1,2,10`). These are positions in the grid, not row IDs.",
      optional: true,
    },
    rowsModifiedSince: {
      type: "string",
      label: "Rows Modified Since",
      description: "Return only rows modified at or after this time. ISO 8601, e.g. `2026-01-01T00:00:00Z`.",
      optional: true,
    },
    columnIds: {
      type: "string",
      label: "Column IDs",
      description: "Comma-separated column IDs to include (e.g. `7894561230,8794561230`). Use **List Columns** to find column IDs. If omitted, all columns are returned.",
      optional: true,
    },
    include: {
      type: "string[]",
      label: "Include",
      description: "Extra elements to fold into the response. Set `filters` to discover saved filter IDs, which is the only way to get them since Smartsheet exposes no filters endpoint.",
      options: SHEET_INCLUDE_OPTIONS,
      optional: true,
    },
    exclude: {
      type: "string[]",
      label: "Exclude",
      description: "Elements to omit from the response. `linkInFromCellDetails` and `linksOutToCellsDetails` trim a lot of payload on sheets with cross-sheet links.",
      options: SHEET_EXCLUDE_OPTIONS,
      optional: true,
    },
    filterId: {
      type: "string",
      label: "Filter ID",
      description: "Apply a saved filter to the returned rows (e.g. `1234567890`). An ID this sheet does not have is ignored silently rather than erroring, so confirm it first: run **Get Sheet** with `filters` in Include and read the returned `filters` array. Smartsheet exposes no filters endpoint, so that is the only way to discover one.",
      optional: true,
    },
    level: {
      type: "integer",
      label: "Level",
      description: "Response format for multi-value columns. At the default level 0 a MULTI_PICKLIST or MULTI_CONTACT_LIST column is reported as TEXT_NUMBER for backwards compatibility, so pass `2` when you need the real column type. Pair it with `objectValue` in Include to get structured cell values.",
      options: [
        0,
        1,
        2,
      ],
      optional: true,
    },
    page: {
      type: "integer",
      label: "Page",
      description: "1-based page of rows to return. Sheets paginate at 100 rows by default, so a large sheet needs either this or a bigger Page Size.",
      min: 1,
      optional: true,
    },
    pageSize: {
      type: "integer",
      label: "Page Size",
      description: "Rows per page. Defaults to 100. Raise it instead of paging when you want the whole sheet in one call.",
      min: 1,
      default: 100,
      optional: true,
    },
  },
  async run({ $ }) {
    // Note there is no `includeAll` here: GET /sheets/{sheetId} does not document it and
    // ignores it, so the prop that used to send it silently returned only the first page.
    // Row volume is controlled with page / pageSize.
    const params = {
      rowIds: this.rowIds,
      rowNumbers: this.rowNumbers,
      rowsModifiedSince: this.rowsModifiedSince,
      columnIds: this.columnIds,
      filterId: this.filterId,
      level: this.level,
      page: this.page,
      pageSize: this.pageSize,
      include: this.include?.length
        ? this.include.join(",")
        : undefined,
      exclude: this.exclude?.length
        ? this.exclude.join(",")
        : undefined,
    };

    const sheetId = await this.smartsheet.resolveSheetId(this.sheetId, {
      $,
    });

    const response = await this.smartsheet.getSheet(sheetId, {
      $,
      params,
    });

    const columnMap = {};
    const seenColumnNames = new Set();
    for (const col of response.columns || []) {
      const normalizedName = col.title.toLowerCase();
      if (seenColumnNames.has(normalizedName)) {
        throw new Error(`Ambiguous column title "${col.title}" in sheet ${sheetId}. Duplicate column names cannot be represented safely in cellsByName - reference cells by column ID instead.`);
      }
      seenColumnNames.add(normalizedName);
      columnMap[col.id] = col.title;
    }

    if (response.rows) {
      for (const row of response.rows) {
        row.cellsByName = {};
        for (const cell of row.cells || []) {
          const name = columnMap[cell.columnId] || `Column ${cell.columnId}`;
          row.cellsByName[name] = cell.displayValue ?? cell.value;
        }
      }
    }

    $.export("$summary", `Retrieved sheet "${response.name}" with ${response.rows?.length || 0} row(s) and ${response.columns?.length || 0} column(s)`);
    return response;
  },
};
