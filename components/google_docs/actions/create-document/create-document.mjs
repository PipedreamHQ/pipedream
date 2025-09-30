import googleDocs from "../../google_docs.app.mjs";

export default {
  key: "google_docs-create-document",
  name: "Create a New Document",
  description: "Create a new document. [See the documentation](https://developers.google.com/docs/api/reference/rest/v1/documents/create)",
  version: "0.1.8",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    googleDocs,
    title: {
      type: "string",
      label: "Title",
      description: "Title of the new document",
    },
    text: {
      propDefinition: [
        googleDocs,
        "text",
      ],
      optional: true,
    },
    folderId: {
      propDefinition: [
        googleDocs,
        "folderId",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    // Create Doc
    const { documentId } = await this.googleDocs.createEmptyDoc(this.title);

    // Insert text
    if (this.text) {
      await this.googleDocs.insertText(documentId, {
        text: this.text,
      });
    }

    // Move file
    if (this.folderId) {
    // Get file to get parents to remove
      const file = await this.googleDocs.getFile(documentId);

      // Move file, removing old parents, adding new parent folder
      await this.googleDocs.updateFile(documentId, {
        fields: "*",
        removeParents: file.parents.join(","),
        addParents: this.folderId,
      });
    }

    // Get updated doc resource to return
    const doc = await this.googleDocs.getDocument(documentId);

    $.export("$summary", `Successfully created document with ID: ${documentId}`);
    return doc;
  },
};
