import googleDocs from "../../google_docs.app.mjs";

export default {
  key: "google_docs-create-document",
  name: "Create Document",
  description: "Create a new Google Doc with an optional body. The body is rendered as Markdown, so you can include headings (`# Title`), bold/italic, bullet/numbered lists, links, and code. Optionally place the doc in a specific Drive folder. Returns `{documentId, title, url}`. [See the documentation](https://developers.google.com/docs/api/reference/rest/v1/documents/create)",
  version: "1.0.1",
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
      description: "Title of the new document.",
    },
    content: {
      type: "string",
      label: "Content",
      description: "Optional body content, written in Markdown. Example: `# Survey\\n- First point\\n- Second point`.",
      optional: true,
    },
    folderId: {
      propDefinition: [
        googleDocs,
        "documentFolderId",
      ],
    },
  },
  async run({ $ }) {
    const { documentId } = await this.googleDocs.createEmptyDoc(this.title);

    if (this.content) {
      await this.googleDocs.insertMarkdownText(documentId, this.content);
    }

    if (this.folderId) {
      const file = await this.googleDocs.getFile(documentId);
      await this.googleDocs.updateFile(documentId, {
        fields: "*",
        removeParents: (file.parents || []).join(","),
        addParents: this.folderId,
      });
    }

    const url = `https://docs.google.com/document/d/${documentId}/edit`;
    $.export("$summary", `Created document "${this.title}" (${documentId})`);
    return {
      documentId,
      title: this.title,
      url,
    };
  },
};
