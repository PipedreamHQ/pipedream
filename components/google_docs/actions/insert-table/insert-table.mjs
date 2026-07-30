import googleDocs from "../../google_docs.app.mjs";

export default {
  key: "google_docs-insert-table",
  name: "Insert Table",
  description: "Insert an empty table with the given number of rows and columns into a Google Doc. Use **Find Document** to resolve a document's name to its ID. [See the documentation](https://developers.google.com/docs/api/reference/rest/v1/documents/request#InsertTableRequest)",
  version: "1.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
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
  },
  async run({ $ }) {
    const request = this.googleDocs._buildRequestForPosition({
      rows: this.rows,
      columns: this.columns,
    }, this.position);
    await this.googleDocs._batchUpdate(this.documentId, "insertTable", request);
    $.export("$summary", `Inserted a ${this.rows}x${this.columns} table into document ${this.documentId}`);
    return this.googleDocs.getDocument(this.documentId);
  },
};
