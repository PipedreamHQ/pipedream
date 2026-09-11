import googleDocs from "../../google_docs.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "google_docs-insert-text",
  name: "Insert Text",
  description: "Insert or append text in a Google Doc, at the beginning, the end, or a specific character index. Use when asked to add, append, or insert a line, paragraph, or block of text. Use **Find Document** to resolve a document's name to its ID. To append text to the end of a doc, use `position: end` (the default). Pass **Fields** (e.g. `documentId,title,revisionId`) to get a compact confirmation instead of the whole document. [See the documentation](https://developers.google.com/docs/api/reference/rest/v1/documents/request#InsertTextRequest)",
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
    text: {
      type: "string",
      label: "Text",
      description: "The text to insert.",
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
      text: this.text,
    }, this.position);
    await this.googleDocs._batchUpdate(this.documentId, "insertText", request);
    $.export("$summary", `Inserted text into document ${this.documentId}`);
    return this.googleDocs.getDocument(this.documentId, false, this.fields);
  },
};
