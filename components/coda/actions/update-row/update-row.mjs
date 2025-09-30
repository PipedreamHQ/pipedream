import coda from "../../coda.app.mjs";

export default {
  key: "coda-update-row",
  name: "Update a Row",
  description: "Updates the specified row in the table. [See docs](https://coda.io/developers/apis/v1#operation/updateRow)",
  version: "0.0.4",
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
      reloadProps: true,
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
    disableParsing: {
      propDefinition: [
        coda,
        "disableParsing",
      ],
    },
  },
  async additionalProps() {
    const props = {};
    const { items } = await this.coda.listColumns(this, this.docId, this.tableId);
    for (const item of items) {
      props[`col_${item.id}`] = {
        type: "string",
        label: `Column: ${item.name}`,
        description: "Leave blank to ignore this column",
        optional: true,
      };
    }
    return props;
  },
  async run({ $ }) {
    const params = {
      disableParsing: this.disableParsing,
    };

    const data = {
      row: {
        cells: this.coda.createRowCells(this),
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
