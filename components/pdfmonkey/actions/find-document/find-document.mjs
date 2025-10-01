import pdfmonkey from "../../pdfmonkey.app.mjs";

export default {
  key: "pdfmonkey-find-document",
  name: "Find Document",
  description: "Find a document within PDFMonkey. [See the documentation](https://docs.pdfmonkey.io/references/api/documents)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
    const document = await this.pdfmonkey.getDocument({
      $,
      documentId: this.documentId,
    });
    $.export("$summary", `Successfully found document with ID ${this.documentId}`);
    return document;
  },
};
