import coda from "../../coda.app.mjs";

export default {
  key: "coda-create-rows",
  name: "Create Rows",
  description: "Insert a row in a selected table. [See the documentation](https://coda.io/developers/apis/v1#operation/upsertRows)",
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
