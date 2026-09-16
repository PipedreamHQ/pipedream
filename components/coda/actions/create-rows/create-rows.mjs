import coda from "../../coda.app.mjs";

export default {
  key: "coda-create-rows",
  name: "Create Rows",
  description: "Creates a new row in a Coda table. Requires a doc ID and table ID — use the **List Docs** and **List Tables** actions to discover these. Column values are set via `columnValues`, a flat object mapping column ID or name to value (use the **List Columns** action to look up column IDs); plain text is fine for text fields, no special formatting needed. Use this action for straightforward inserts; if a matching row might already exist and you want to avoid creating a duplicate, use **Upsert Rows** instead. [See the documentation](https://coda.io/developers/apis/v1#operation/upsertRows)",
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
    disableParsing: {
      propDefinition: [
        coda,
        "disableParsing",
      ],
    },
    columnValues: {
      type: "object",
      label: "Column Values",
      description: "A flat object mapping column ID or name to the value to set for the new row, e.g. `{ \"c-abc123\": \"foo\", \"Status\": \"Done\" }`. Use the **List Columns** action to look up column IDs.",
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {
      disableParsing: this.disableParsing,
    };

    const data = {
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

    $.export("$summary", "Created row successfully");
    return response;
  },
};
