import coda from "../../coda.app.mjs";

export default {
  key: "coda-upsert-rows",
  name: "Upsert Rows",
  description: "Creates a new row or updates existing rows if any upsert key columns are provided. When upserting, if multiple rows match the specified key column(s), they will all be updated with the specified value. [See docs](https://coda.io/developers/apis/v1#operation/upsertRows)",
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
    keyColumns: {
      propDefinition: [
        coda,
        "keyColumns",
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
      keyColumns: this.keyColumns,
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

    $.export("$summary", "Upserted row(s) successfully");
    return response;
  },
};
