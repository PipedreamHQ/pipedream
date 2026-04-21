import coda from "../../coda.app.mjs";

export default {
  key: "coda-find-row",
  name: "Find Row",
  description: "Searches for a row in the selected table using a column match search. [See docs](https://coda.io/developers/apis/v1#operation/listRows)",
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
    columnId: {
      propDefinition: [
        coda,
        "columnId",
        (c) => ({
          docId: c.docId,
          tableId: c.tableId,
        }),
      ],
      description: "ID of the column. This field is required if querying",
      optional: true,
    },
    query: {
      propDefinition: [
        coda,
        "query",
      ],
      description: "Query used to filter returned rows",
      optional: true,
    },
    sortBy: {
      propDefinition: [
        coda,
        "sortBy",
      ],
      description: "Specifies the sort order of the rows returned. If left unspecified, rows are returned by creation time ascending",
      options: [
        "createdAt",
        "natural",
        "updatedAt",
      ],
    },
    visibleOnly: {
      propDefinition: [
        coda,
        "visibleOnly",
      ],
    },
    useColumnNames: {
      type: "boolean",
      label: "Use Column Names",
      description: "Use column names instead of column IDs in the returned output",
      optional: true,
    },
    valueFormat: {
      type: "string",
      label: "Value Format",
      description: "The format that individual cell values are returned as",
      optional: true,
      options: [
        "simple",
        "simpleWithArrays",
        "rich",
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
      visibleOnly: this.visibleOnly,
      useColumnNames: this.useColumnNames,
      valueFormat: this.valueFormat,
    };

    if (this.columnId && this.query) {
      params.query = `${this.columnId}:"${this.query}"`;
    }

    let items = [];
    let response;
    do {
      response = await this.coda.findRow(
        $,
        this.docId,
        this.tableId,
        params,
      );
      items.push(...response.items);
      params.pageToken = response.nextPageToken;
    } while (params.pageToken && items.length < this.max);

    if (items.length > this.max) items.length = this.max;

    if (items.length > 0) {
      $.export("$summary", `Found ${items.length} rows`);
    } else {
      $.export("$summary", `No rows found with the search query: ${this.query}`);
    }
    return {
      items,
    };
  },
};
