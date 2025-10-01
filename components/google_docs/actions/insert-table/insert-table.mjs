import googleDocs from "../../google_docs.app.mjs";

export default {
  key: "google_docs-insert-table",
  name: "Insert Table",
  description: "Insert a table into a document. [See the documentation](https://developers.google.com/workspace/docs/api/reference/rest/v1/documents/request#inserttablerequest)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    googleDocs,
    docId: {
      propDefinition: [
        googleDocs,
        "docId",
      ],
    },
    rows: {
      type: "integer",
      label: "Rows",
      description: "The number of rows in the table",
    },
    columns: {
      type: "integer",
      label: "Columns",
      description: "The number of columns in the table",
    },
    index: {
      type: "integer",
      label: "Index",
      description: "The index to insert the table at",
      default: 1,
      optional: true,
    },
    tabId: {
      propDefinition: [
        googleDocs,
        "tabId",
        (c) => ({
          documentId: c.docId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const table = {
      rows: this.rows,
      columns: this.columns,
      location: {
        index: this.index,
        tabId: this.tabId,
      },
    };
    await this.googleDocs.insertTable(this.docId, table);
    $.export("$summary", "Successfully inserted table");
    return this.googleDocs.getDocument(this.docId, !!this.tabId);
  },
};
