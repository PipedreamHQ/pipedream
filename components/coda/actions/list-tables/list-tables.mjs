import coda from "../../coda.app.mjs";

export default {
  key: "coda-list-tables",
  name: "List Tables",
  description: "Lists tables in a doc",
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
    sortBy: {
      propDefinition: [
        coda,
        "sortBy",
      ],
    },
    tableTypes: {
      type: "string[]",
      label: "tableTypes",
      description: "Comma-separated list of table types to include in results",
      optional: true,
      default: [
        "table",
        "view",
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
  async run() {
    let params = {
      limit: this.limit,
      pageToken: this.pageToken,
      sortBy: this.sortBy,
      tableTypes: this.tableTypes.toString(),
    };
    return await this.coda.listTables(
      this.docId,
      params,
    );
  },
};
