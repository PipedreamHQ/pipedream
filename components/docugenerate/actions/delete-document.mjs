import app from "../docugenerate.app.mjs";

export default {
  key: "docugenerate-delete-document",
  name: "Delete Document",
  description: "Deletes a specific document",
  version: "1.0.0",
  type: "action",
  props: {
    app,
    documentId: {
      type: "string",
      label: "Document",
      description: "The ID of the document",
    },
  },
  async run({ $ }) {
    const response = await this.app.deleteDocument($, this.documentId);

    $.export("$summary", `Successfully deleted the document ${this.documentId}`);
    return response;
  },
};
