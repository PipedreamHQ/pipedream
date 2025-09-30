import pdfmonkey from "../../pdfmonkey.app.mjs";

export default {
  key: "pdfmonkey-delete-document",
  name: "Delete Document",
  description: "Deletes a specific document using its ID. [See the documentation](https://docs.pdfmonkey.io/references/api/documents)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    pdfmonkey,
    documentId: {
      propDefinition: [
        pdfmonkey,
        "documentId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.pdfmonkey.deleteDocument({
      $,
      documentId: this.documentId,
    });
    $.export("$summary", `Deleted document with ID ${this.documentId}`);
    return response;
  },
};
