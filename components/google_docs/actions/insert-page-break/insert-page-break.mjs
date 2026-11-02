import googleDocs from "../../google_docs.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "google_docs-insert-page-break",
  name: "Insert Page Break",
  description: "Insert a page break into a Google Doc at the beginning, end, or a specific character index. Use **Find Document** to resolve a document's name to its ID. In a multi-tab document, set **Tab ID** to choose which tab receives the page break — without it the break goes into the document's first tab; use **List Tabs** to get the IDs. [See the documentation](https://developers.google.com/docs/api/reference/rest/v1/documents/request#InsertPageBreakRequest)",
  version: "1.4.0",
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
    tabId: {
      propDefinition: [
        googleDocs,
        "contentTabId",
      ],
    },
    fields: {
      propDefinition: [
        googleDocs,
        "fields",
      ],
    },
    suggestMode: {
      propDefinition: [
        googleDocs,
        "suggestMode",
      ],
    },
  },
  async run({ $ }) {
    await utils.validateFieldMask(this.googleDocs, this.documentId, this.fields, this.tabId);

    const request = this.googleDocs._buildRequestForPosition({}, this.position, this.tabId);
    const response = await this.googleDocs._batchUpdate(this.documentId, "insertPageBreak", request, this.googleDocs.writeControl(this.suggestMode));
    const target = this.tabId
      ? `tab ${this.tabId} of document ${this.documentId}`
      : `document ${this.documentId}`;
    $.export("$summary", `Inserted page break into ${target}${this.suggestMode
      ? " as a suggestion"
      : ""}`);
    return this.googleDocs.withSuggestionIds(
      await this.googleDocs.getWriteResult(this.documentId, this.tabId, this.fields),
      this.suggestMode,
      response,
    );
  },
};
