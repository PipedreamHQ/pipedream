import coda from "../../coda.app.mjs";

export default {
  key: "coda-list-columns",
  name: "List Columns",
  description: "Lists columns in a table",
  version: "0.0.1",
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
    limit: {
      propDefinition: [
        coda,
        "limit",
      ],
    },
    pageToken: {
      propDefinition: [
        coda,
        "pageToken",
      ],
    },
    visibleOnly: {
      propDefinition: [
        coda,
        "visibleOnly",
      ],
      description: "If true, returns only visible columns for the table",
    },
  },
  async run() {
    var params = {
      limit: this.limit,
      pageToken: this.pageToken,
      visibleOnly: this.visibleOnly,
    };
    return await this.coda.listColumns(
      this.docId,
      this.tableId,
      params,
    );
  },
};
