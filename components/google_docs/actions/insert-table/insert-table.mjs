import googleDocs from "../../google_docs.app.mjs";

export default {
  key: "google_docs-insert-table",
  name: "Insert Table",
  description: "Insert an empty table with the given number of rows and columns into a Google Doc. If you already have the data, use **Write Table** instead so you don't have to fill cells one by one. Use **Find Document** to resolve a document's name to its ID. In a multi-tab document, set **Tab ID** to choose which tab receives the table — without it the table goes into the document's first tab; use **List Tabs** to get the IDs. [See the documentation](https://developers.google.com/docs/api/reference/rest/v1/documents/request#InsertTableRequest)",
  version: "1.1.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
  props: {
    googleDocs,
    documentId: {
      propDefinition: [
        googleDocs,
        "documentId",
      ],
    },
    rows: {
      type: "integer",
      label: "Rows",
      description: "The number of rows in the table. Must be a positive integer (e.g. `3`).",
      min: 1,
    },
    columns: {
      type: "integer",
      label: "Columns",
      description: "The number of columns in the table. Must be a positive integer (e.g. `4`).",
      min: 1,
    },
    position: {
      propDefinition: [
        googleDocs,
        "position",
      ],
    },
    tabId: {
      propDefinition: [
        googleDocs,
        "contentTabId",
      ],
    },
  },
  async run({ $ }) {
    const request = this.googleDocs._buildRequestForPosition({
      rows: this.rows,
      columns: this.columns,
    }, this.position, this.tabId);
    await this.googleDocs._batchUpdate(this.documentId, "insertTable", request);
    const target = this.tabId
      ? `tab ${this.tabId} of document ${this.documentId}`
      : `document ${this.documentId}`;
    $.export("$summary", `Inserted a ${this.rows}x${this.columns} table into ${target}`);
    return this.googleDocs.getWriteResult(this.documentId, this.tabId);
  },
};
