import coda from "../../coda.app.mjs";

export default {
  key: "coda_create-rows",
  name: "Create Rows",
  description: "Creates rows in a selected table",
  version: "0.0.4",
  type: "action",
  props: {
    coda,
    docId: {
      propDefinition: [
        coda,
        "sourceDoc",
        (c) => c,
      ],
      label: "Doc ID",
      description: "ID of the Doc",
      optional: false,
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
    rows: {
      type: "string",
      label: "Rows to create",
      description: "Array of rows objects to create. Example: `[{cells:[{column:\"<columnId>\",value:\"<value>\"}]}]`. More information at [Coda API](https://coda.io/developers/apis/v1#operation/upsertRows)",
    },
    disableParsing: {
      type: "boolean",
      label: "Disable Parsing",
      description: "If true, the API will not attempt to parse the data in any way",
      optional: true,
    },
  },
  async run() {
    var data = {
      rows: JSON.parse(this.rows),
    };

    var params = {
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
