import coda from "../../coda.app.mjs";

export default {
  key: "coda-get-row",
  name: "Get Row",
  description: "Fetch a single row by name or ID. [See docs](https://coda.io/developers/apis/v1#tag/Rows/operation/getRow)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
    useColumnNames: {
      type: "boolean",
      label: "Use Column Names",
      description: "Use column names instead of column IDs in the returned output",
      optional: true,
    },
    valueFormat: {
      type: "string",
      label: "Value Format",
      description: "The format that individual cell values are returned as",
      optional: true,
      options: [
        "simple",
        "simpleWithArrays",
        "rich",
      ],
    },
  },
  async run({ $ }) {
    let params = {
      useColumnNames: this.useColumnNames,
      valueFormat: this.valueFormat,
    };

    const response = await this.coda.getRow(
      $,
      this.docId,
      this.tableId,
      this.rowId,
      params,
    );

    $.export("$summary", `Successfully fetched row with ID ${response.id}.`);

    return response;
  },
};
