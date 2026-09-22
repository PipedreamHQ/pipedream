import coda from "../../coda.app.mjs";

export default {
  key: "coda-upsert-rows",
  name: "Upsert Rows",
  description: "Creates a new row, or updates an existing row if one already matches the given `keyColumns` values, in a Coda table. Requires a doc ID and table ID — use the **List Docs** and **List Tables** actions to discover these. `keyColumns` identifies which column(s) uniquely identify a row (e.g. a name or external ID column) — use the **List Columns** action to look up column IDs; leave it blank to always insert a new row instead of matching an existing one. Column values are set via `columnValues`, a flat object mapping column ID or name to value. Use this action instead of **Create Rows** when a matching row might already exist and you want to avoid duplicates, or instead of **Update Row** when you don't already know the target row's ID. When upserting, if multiple rows match the specified key column(s), they will all be updated with the specified value. [See the documentation](https://coda.io/developers/apis/v1#operation/upsertRows)",
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
      description: "Column ID(s) to use as upsert keys (e.g. `c-abc123`) — provide one or more column IDs, not a JSON array string. Rows matching all key column values will be updated instead of a new row being created. Leave blank to always insert a new row. Use the **List Columns** action to look up column IDs.",
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
