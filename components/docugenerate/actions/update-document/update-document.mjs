import app from "../../docugenerate.app.mjs";

export default {
  key: "docugenerate-update-document",
  name: "Update Document",
  description: "Updates a specific document. [See the documentation](https://api.docugenerate.com/#/Document/updateDocument)",
  version: "0.0.3",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    documentId: {
      type: "string",
      label: "Document",
      description: "The ID of the document",
    },
    name: {
      type: "string",
      label: "Name",
      description: "The new name for the document",
    },
  },
  async run({ $ }) {
    const response = await this.app.updateDocument($, this.documentId, {
      name: this.name,
    });

    $.export("$summary", `Successfully updated the document ${this.documentId}`);
    return response;
  },
};
