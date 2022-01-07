import coda from "../../coda.app.mjs";

export default {
  key: "coda-update-row",
  name: "Update a Row",
  description: "Updates the specified row in the table. This endpoint will always return a 202, so long as the row exists and is accessible (and the update is structurally valid). Row updates are generally processed within several seconds. When updating using a name as opposed to an ID, an arbitrary row will be affected.",
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
    columnId: {
      propDefinition: [
        coda,
        "columnId",
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
    row: {
      type: "string",
      label: "Row",
      description: "An edit made to a particular row.",
    },
  },
  async run() {
    let params = {
      disableParsing: this.disableParsing,
    };
    let data = {
      row: JSON.parse(this.row),
    };
    return await this.coda.updateRow(
      this.docId,
      this.tableId,
      this.rowId,
      data,
      params,
    );
  },
};
