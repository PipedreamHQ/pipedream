import coda from "../../coda.app.mjs";

export default {
  key: "coda-delete-row",
  name: "Delete Row",
  description: "Delete a single row by name or ID. [See docs](https://coda.io/developers/apis/v1#tag/Rows/operation/deleteRow)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    coda,
    docId: {
      propDefinition: [
        coda,
        "docId",
      ],
    },
    tableId: {
      propDefinition: [
        coda,
        "tableId",
        (c) => ({
          docId: c.docId,
        }),
      ],
    },
    rowId: {
      propDefinition: [
        coda,
        "rowId",
        (c) => ({
          docId: c.docId,
          tableId: c.tableId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.coda.deleteRow(
      $,
      this.docId,
      this.tableId,
      this.rowId,
    );

    $.export("$summary", `Successfully deleted row with ID ${response.id}.`);

    return response;
  },
};
