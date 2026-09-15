import coda from "../../coda.app.mjs";

export default {
  key: "coda-update-row",
  name: "Update a Row",
  description: "Updates an existing row in a Coda table. Requires a doc ID, table ID, and row ID — use the **List Docs**, **List Tables**, and **Find Row** actions to discover these. Column values to change are set via `columnValues`, a flat object mapping column ID or name to value (use the **List Columns** action to look up column IDs). Use this action when you already know the specific row's ID; if you only know a value to match on (e.g. update-or-create by name) rather than the row's own ID, use **Upsert Rows** instead. [See the documentation](https://coda.io/developers/apis/v1#operation/updateRow)",
  version: "1.0.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
  props: {
    coda,
    docId: {
      propDefinition: [
        coda,
        "docIdStatic",
      ],
    },
    tableId: {
      propDefinition: [
        coda,
        "tableIdStatic",
      ],
    },
    rowId: {
      type: "string",
      label: "Row ID",
      description: "The ID of the row to update (e.g. `i-tuVwxYz`). Use the **Find Row** action to look up row IDs.",
    },
    disableParsing: {
      propDefinition: [
        coda,
        "disableParsing",
      ],
    },
    columnValues: {
      type: "object",
      label: "Column Values",
      description: "A flat object mapping column ID or name to the value to set on the row, e.g. `{ \"c-abc123\": \"foo\", \"Status\": \"Done\" }`. Use the **List Columns** action to look up column IDs.",
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {
      disableParsing: this.disableParsing,
    };

    const data = {
      row: {
        cells: Object.entries(this.columnValues || {}).map(([
          column,
          value,
        ]) => ({
          column,
          value,
        })),
      },
    };

    const response = await this.coda.updateRow(
      $,
      this.docId,
      this.tableId,
      this.rowId,
      data,
      params,
    );

    $.export("$summary", "Updated row successfully");
    return response;
  },
};
