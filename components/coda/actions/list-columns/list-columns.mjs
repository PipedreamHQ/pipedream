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
    visibleOnly: {
      propDefinition: [
        coda,
        "visibleOnly",
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
  },
  async run({ $ }) {
    let params = {
      visibleOnly: this.visibleOnly,
      limit: this.limit,
      pageToken: this.pageToken,
    };

    let response = await this.coda.listColumns(
      this.docId,
      this.tableId,
      params,
    );

    $.export("$summary", `Retrieved ${response.items.length} column(s)`);
    return response;
  },
};
