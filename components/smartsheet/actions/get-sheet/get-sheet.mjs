import smartsheet from "../../smartsheet.app.mjs";

export default {
  key: "smartsheet-get-sheet",
  name: "Get Sheet",
  description:
    "Get a sheet's full structure: column definitions (name, type, options, ID), all rows with cell values, and sheet metadata."
    + " This is the primary schema discovery tool — call it BEFORE **Add Rows** or **Update Rows** to learn column names, types, and IDs."
    + " Returns rows with cell values keyed by column name for readability."
    + " For a lightweight column-only view, use **List Columns** instead."
    + " [See the documentation](https://developers.smartsheet.com/api/smartsheet/openapi/sheets/getsheet)",
  version: "0.0.1",
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
      label: "Sheet ID",
      description: "The ID of the sheet to retrieve. Use **List Sheets** to find sheet IDs.",
    },
    rowNumbers: {
      type: "string",
      label: "Row Numbers",
      description: "Comma-separated list of row numbers to include. If omitted, all rows are returned.",
      optional: true,
    },
    columnIds: {
      type: "string",
      label: "Column IDs",
      description: "Comma-separated list of column IDs to include. If omitted, all columns are returned.",
      optional: true,
    },
    includeAll: {
      type: "boolean",
      label: "Include All Rows",
      description: "Set to `true` to return all rows without pagination.",
      optional: true,
    },
    filterId: {
      type: "string",
      label: "Filter ID",
      description: "Apply a saved filter to the returned rows.",
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {
      ...(this.rowNumbers
        ? {
          rowNumbers: this.rowNumbers,
        }
        : {}),
      ...(this.columnIds
        ? {
          columnIds: this.columnIds,
        }
        : {}),
      ...(this.includeAll
        ? {
          includeAll: true,
        }
        : {}),
      ...(this.filterId
        ? {
          filterId: this.filterId,
        }
        : {}),
    };

    const response = await this.smartsheet.getSheet(this.sheetId, {
      $,
      params,
    });

    const columnMap = {};
    for (const col of response.columns || []) {
      columnMap[col.id] = col.title;
    }

    if (response.rows) {
      for (const row of response.rows) {
        row.cellsByName = {};
        for (const cell of row.cells || []) {
          const name = columnMap[cell.columnId] || `Column ${cell.columnId}`;
          row.cellsByName[name] = cell.displayValue || cell.value;
        }
      }
    }

    $.export("$summary", `Retrieved sheet "${response.name}" with ${response.rows?.length || 0} row(s) and ${response.columns?.length || 0} column(s)`);
    return response;
  },
};
