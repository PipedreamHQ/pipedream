import coda from "../../coda.app.mjs";

export default {
  key: "coda_find-row",
  name: "Find Row",
  description: "Searches for a Coda row in the selected table using a column match search",
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
    query: {
      propDefinition: [
        coda,
        "query",
      ],
      description: "Example: `query=c-tuVwxYz:\"Apple\"`. Query used to filter returned rows, specified as <column_id_or_name>:<value>. If you'd like to use a column name instead of an ID, you must quote it (e.g., \"My Column\":123). Also note that value is a JSON value; if you'd like to use a string, you must surround it in quotes (e.g., \"groceries\").",
    },
    sortBy: {
      propDefinition: [
        coda,
        "sortBy",
      ],
      description: "Specifies the sort order of the rows returned. If left unspecified, rows are returned by creation time ascending. \"UpdatedAt\" sort ordering is the order of rows based upon when they were last updated. This does not include updates to calculated values. \"Natural\" sort ordering is the order that the rows appear in the table view in the application. This ordering is only meaningfully defined for rows that are visible (unfiltered). Because of this, using this sort order will imply visibleOnly=true, that is, to only return visible rows. If you pass sortBy=natural and visibleOnly=false explicitly, this will result in a Bad Request error as this condition cannot be satisfied.",
      options: [
        "createdAt",
        "natural",
        "updatedAt",
      ],
    },
    useColumnNames: {
      type: "boolean",
      label: "Use Column Names",
      description: "Use column names instead of column IDs in the returned output",
      optional: true,
      default: false,
    },
    valueFormat: {
      type: "string",
      label: "Value Format",
      description: "The format that cell values are returned as",
      optional: true,
      options: [
        "simple",
        "simpleWithArrays",
        "rich",
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
    syncToken: {
      type: "string",
      label: "Sync Token",
      description: "An opaque token returned from a previous call that can be used to return results that are relevant to the query since the call where the syncToken was generated.",
      optional: true,
    },
  },
  async run() {
    let params = {
      query: this.query,
      sortBy: this.sortBy,
      useColumnNames: this.useColumnNames,
      valueFormat: this.valueFormat,
      visibleOnly: this.visibleOnly,
      limit: this.limit,
      pageToken: this.pageToken,
      syncToken: this.syncToken,
    };
    return await this.coda.findRow(
      this.docId,
      this.tableId,
      params,
    );
  },
};
