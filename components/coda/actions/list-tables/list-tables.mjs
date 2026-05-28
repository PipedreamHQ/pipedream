import coda from "../../coda.app.mjs";

export default {
  key: "coda-list-tables",
  name: "List Tables",
  description: "Lists tables in a doc. [See docs](https://coda.io/developers/apis/v1#operation/listTables)",
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
    sortBy: {
      propDefinition: [
        coda,
        "sortBy",
      ],
    },
    tableTypes: {
      type: "string[]",
      label: "tableTypes",
      description: "Comma-separated list of table types to include in results. Items: `\"table\"`,`\"view\"`",
      optional: true,
      default: [
        "table",
        "view",
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
      sortBy: this.sortBy,
      tableTypes: this.tableTypes.toString(),
    };

    let items = [];
    let response;
    do {
      response = await this.coda.listTables(
        $,
        this.docId,
        params,
      );
      items.push(...response.items);
      params.pageToken = response.nextPageToken;
    } while (params.pageToken && items.length < this.max);

    if (items.length > this.max) items.length = this.max;

    $.export("$summary", `Retrieved ${items.length} ${this.tableTypes}(s)`);
    return items;
  },
};
