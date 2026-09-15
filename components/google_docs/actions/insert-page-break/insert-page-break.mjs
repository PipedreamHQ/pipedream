import googleDocs from "../../google_docs.app.mjs";
import utils from "../../common/utils.mjs";
import { DOCUMENT_FIELDS } from "../../common/constants.mjs";

export default {
  key: "google_docs-insert-page-break",
  name: "Insert Page Break",
  description: "Insert a page break into a Google Doc at the beginning, end, or a specific character index. Use **Find Document** to resolve a document's name to its ID. Pass **Fields** (e.g. `documentId,title,revisionId`) to get a compact confirmation instead of the whole document. [See the documentation](https://developers.google.com/docs/api/reference/rest/v1/documents/request#InsertPageBreakRequest)",
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
    position: {
      propDefinition: [
        googleDocs,
        "position",
      ],
    },
    fields: {
      type: "string",
      label: "Fields",
      description: `Optional Google Docs API field mask limiting which document fields are returned, e.g. \`documentId,title,revisionId\` to confirm the write without pulling the whole document back. Valid top-level fields: ${DOCUMENT_FIELDS.map((field) => `\`${field}\``).join(", ")}. There is no \`url\` field, and an invalid mask fails the call before the document is changed. Nested selections are allowed, e.g. \`body/content\` or \`tabs(documentTab(body))\`. Leave blank to return the full document. [See the documentation](https://developers.google.com/workspace/docs/api/reference/rest/v1/documents#Document)`,
      optional: true,
    },
  },
  async run({ $ }) {
    await utils.validateFieldMask(this.googleDocs, this.documentId, this.fields);

    const request = this.googleDocs._buildRequestForPosition({}, this.position);
    await this.googleDocs._batchUpdate(this.documentId, "insertPageBreak", request);
    $.export("$summary", `Inserted page break into document ${this.documentId}`);
    return this.googleDocs.getDocument(this.documentId, false, this.fields);
  },
};
