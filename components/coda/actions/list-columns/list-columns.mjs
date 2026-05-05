import coda from "../../coda.app.mjs";

export default {
  key: "coda-list-columns",
  name: "List Columns",
  description: "Lists columns in a table. [See docs](https://coda.io/developers/apis/v1#operation/listColumns)",
  version: "0.0.5",
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
    visibleOnly: {
      propDefinition: [
        coda,
        "visibleOnly",
      ],
    },
    max: {
      propDefinition: [
        coda,
        "max",
      ],
    },
  },
  async run({ $ }) {
    let params = {
      visibleOnly: this.visibleOnly,
    };

    let items = [];
    let response;
    do {
      response = await this.coda.listColumns(
        $,
        this.docId,
        this.tableId,
        params,
      );
      items.push(...response.items);
      params.pageToken = response.nextPageToken;
    } while (params.pageToken && items.length < this.max);

    if (items.length > this.max) items.length = this.max;

    $.export("$summary", `Retrieved ${items.length} column(s)`);

    return items;
  },
};
