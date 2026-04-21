import coda from "../../coda.app.mjs";

export default {
  key: "coda-create-rows",
  name: "Create Rows",
  description: "Insert a row in a selected table. [See docs](https://coda.io/developers/apis/v1#operation/upsertRows)",
  version: "0.0.5",
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
      rows: [
        {
          cells: this.coda.createRowCells(this),
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
