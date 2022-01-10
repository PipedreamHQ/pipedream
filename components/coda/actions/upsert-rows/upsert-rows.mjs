import coda from "../../coda.app.mjs";

export default {
  key: "coda-upsert-rows",
  name: "Upsert Rows",
  description: `Creates a new row or updates existing rows if any upsert key columns are provided. When upserting, if multiple rows match the specified key column(s), they will all be updated with the specified value.
    More information at [Coda API](https://coda.io/developers/apis/v1#operation/upsertRows)`,
  version: "0.0.1",
  type: "action",
  props: {
    coda,
    docId: {
      propDefinition: [
        coda,
        "docId",
        (c) => c,
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
    rows: {
      propDefinition: [
        coda,
        "rows",
      ],
    },
  },
  async run({ $ }) {
    let data = {
      rows: JSON.parse(this.rows),
      keyColumns: this.keyColumns,
    };

    let params = {
      disableParsing: this.disableParsing,
    };

    let response = await this.coda.createRows(
      this.docId,
      this.tableId,
      data,
      params,
    );

    $.export("$summary", "Upserted row(s) successfully");
    return response;
  },
};
