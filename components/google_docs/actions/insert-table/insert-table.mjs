import googleDocs from "../../google_docs.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "google_docs-insert-table",
  name: "Insert Table",
  description: "Insert an empty table with the given number of rows and columns into a Google Doc. If you already have the data, use **Write Table** instead so you don't have to fill cells one by one. Use **Find Document** to resolve a document's name to its ID. Pass **Fields** (e.g. `documentId,title,revisionId`) to get a compact confirmation instead of the whole document. [See the documentation](https://developers.google.com/docs/api/reference/rest/v1/documents/request#InsertTableRequest)",
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
    fields: {
      type: "string",
      label: "Fields",
      description: "Optional Google Docs API field mask limiting which document fields are returned, e.g. `documentId,title,revisionId` to confirm the write without pulling the whole document back. Only top-level fields of the Docs document resource are valid: `documentId`, `title`, `revisionId`, `body`, `documentStyle`, `namedStyles`, `inlineObjects`, `lists`, `namedRanges`, `tabs`. There is no `url` field, and an unknown field name fails the call. Nested selections are allowed, e.g. `body/content` or `tabs(documentTab(body))`. Leave blank to return the full document. [See the documentation](https://developers.google.com/workspace/docs/api/reference/rest/v1/documents#Document)",
      optional: true,
    },
  },
  async run({ $ }) {
    utils.validateFieldMask(this.fields);

    const request = this.googleDocs._buildRequestForPosition({
      rows: this.rows,
      columns: this.columns,
    }, this.position);
    await this.googleDocs._batchUpdate(this.documentId, "insertTable", request);
    $.export("$summary", `Inserted a ${this.rows}x${this.columns} table into document ${this.documentId}`);
    return this.googleDocs.getDocument(this.documentId, false, this.fields);
  },
};
