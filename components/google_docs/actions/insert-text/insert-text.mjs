import { ConfigurationError } from "@pipedream/platform";
import googleDocs from "../../google_docs.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "google_docs-insert-text",
  name: "Insert Text",
  description: "Insert text into a Google Doc at the beginning, end, or a specific character index. Use **Find Document** to resolve a document's name to its ID. To append text to the end of a doc, use `position: end` (the default). In a multi-tab document, set **Tab ID** to choose which tab receives the text — without it the text goes into the document's first tab; use **List Tabs** to get the IDs. [See the documentation](https://developers.google.com/docs/api/reference/rest/v1/documents/request#InsertTextRequest)",
  version: "1.3.0",
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
    if (this.tabId && this.fields) {
      throw new ConfigurationError("Tab ID cannot be combined with a Fields mask: a mask selects top-level document fields, while a tab response is assembled separately. Remove the Fields mask or omit the Tab ID.");
    }
    await utils.validateFieldMask(this.googleDocs, this.documentId, this.fields);

    const request = this.googleDocs._buildRequestForPosition({
      text: this.text,
    }, this.position, this.tabId);
    const response = await this.googleDocs._batchUpdate(this.documentId, "insertText", request, this.googleDocs.writeControl(this.suggestMode));
    const target = this.tabId
      ? `tab ${this.tabId} of document ${this.documentId}`
      : `document ${this.documentId}`;
    $.export("$summary", `Inserted text into ${target}${this.suggestMode
      ? " as a suggestion"
      : ""}`);
    return this.googleDocs.withSuggestionIds(
      await this.googleDocs.getWriteResult(this.documentId, this.tabId, this.fields),
      this.suggestMode,
      response,
    );
  },
};
