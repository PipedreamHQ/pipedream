import coda from "../../coda.app.mjs";

export default {
  key: "coda_list-tables",
  name: "List Tables",
  description: "Lists tables in a Coda Doc",
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
    sortBy: {
      propDefinition: [
        coda,
        "sortBy",
      ],
      options: [
        "name",
      ],
    },
    tableTypes: {
      type: "string[]",
      label: "tableTypes",
      description: "Comma-separated list of table types to include in results. If omitted, includes both tables and views.",
      optional: true,
      default: [
        "table",
        "view",
      ],
    },
  },
  async run() {
    var params = {
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
