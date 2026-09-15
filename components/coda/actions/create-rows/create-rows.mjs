import coda from "../../coda.app.mjs";

export default {
  key: "coda-create-rows",
  name: "Create Rows",
  description: "Insert a row in a selected table. [See docs](https://coda.io/developers/apis/v1#operation/upsertRows)",
  version: "1.0.0",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
  props: {
    coda,
    docId: {
      type: "string",
      label: "Doc ID",
      description: "The ID of the Coda doc (e.g. `AbCDeFGhij`). Use the **List Docs** action to look up doc IDs.",
    },
    tableId: {
      type: "string",
      label: "Table ID",
      description: "The ID of the table (e.g. `grid-pqRst-U`). Use the **List Tables** action to look up table IDs for a doc.",
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
