import coda from "../../coda.app.mjs";

export default {
  key: "coda-find-row",
  name: "Find Row",
  description: "Searches for a row in the selected table using a column match search. [See docs](https://coda.io/developers/apis/v1#operation/listRows)",
  version: "0.0.1",
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
    },
    query: {
      propDefinition: [
        coda,
        "query",
      ],
      description: "Query used to filter returned rows",
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
    syncToken: {
      type: "string",
      label: "Sync Token",
      description: "An opaque token returned from a previous call that can be used to return results that are relevant to the query since the call where the syncToken was generated",
      optional: true,
    },
  },
  async run({ $ }) {
    let params = {
      query: `${this.columnId}:"${this.query}"`,
      sortBy: this.sortBy,
      visibleOnly: this.visibleOnly,
      useColumnNames: this.useColumnNames,
      valueFormat: this.valueFormat,
      limit: this.limit,
      pageToken: this.pageToken,
      syncToken: this.syncToken,
    };

    let response = await this.coda.findRow(
      $,
      this.docId,
      this.tableId,
      params,
    );

    if (response.items.length > 0) {
      $.export("$summary", `Found ${response.items.length} rows`);
    } else {
      $.export("$summary", `No rows found with the search query: ${this.query}`);
    }
    return response;
  },
};
