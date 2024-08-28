import documenso from "../../documenso.app.mjs";

export default {
  key: "documenso-send-document",
  name: "Send Document",
  description: "Send a document within Documenso for signing. [See the documentation](https://app.documenso.com/api/v1/openapi)",
  version: "0.0.1",
  type: "action",
  props: {
    documenso,
    documentId: {
      propDefinition: [
        documenso,
        "documentId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.documenso.sendDocumentForSigning({
      $,
      documentId: this.documentId,
      data: {
        sendEmail: true,
      },
    });
    $.export("$summary", `Document with ID ${this.documentId} sent successfully.`);
    return response;
  },
};
