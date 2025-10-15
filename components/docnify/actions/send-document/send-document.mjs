import docnify from "../../docnify.app.mjs";

export default {
  key: "docnify-send-document",
  name: "Send Document",
  description: "Send a document within Docnify for signing. [See the documentation](https://app.docnify.io/api/v1/openapi)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    docnify,
    documentId: {
      propDefinition: [
        docnify,
        "documentId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.docnify.sendDocumentForSigning({
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
