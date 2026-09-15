import coda from "../../coda.app.mjs";

export default {
  key: "coda-upsert-rows",
  name: "Upsert Rows",
  description: "Creates a new row or updates existing rows if any upsert key columns are provided. When upserting, if multiple rows match the specified key column(s), they will all be updated with the specified value. [See the documentation](https://coda.io/developers/apis/v1#operation/upsertRows)",
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
    keyColumns: {
      type: "string[]",
      label: "Key Columns",
      description: "Column ID(s) to use as upsert keys (e.g. `[\"c-abc123\"]`) — rows matching all key column values will be updated instead of a new row being created. Leave blank to always insert a new row. Use the **List Columns** action to look up column IDs.",
      optional: true,
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
      keyColumns: this.keyColumns,
      rows: [
        {
          cells: Object.entries(this.columnValues || {}).map(([
            column,
            value,
          ]) => ({
            column,
            value,
          })),
        },
      ],
    };

    const response = await this.coda.createRows(
      $,
      this.docId,
      this.tableId,
      data,
      params,
    );

    $.export("$summary", "Upserted row(s) successfully");
    return response;
  },
};
