import coda from "../../coda.app.mjs";

export default {
  key: "coda-create-rows",
  name: "Create Rows",
  description: "Creates rows in a selected table",
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
    disableParsing: {
      propDefinition: [
        coda,
        "disableParsing",
      ],
    },
    rows: {
      type: "string",
      label: "Rows to create",
      description: "Array of rows objects to create. Example: `[{cells:[{column:\"<columnId>\",value:\"<value>\"}]}]`. More information at [Coda API](https://coda.io/developers/apis/v1#operation/upsertRows)",
    },
  },
  async run() {
    let data = {
      rows: JSON.parse(this.rows),
    };

    let params = {
      disableParsing: this.disableParsing,
    };

    return await this.coda.createRows(
      this.docId,
      this.tableId,
      data,
      params,
    );
  },
};
