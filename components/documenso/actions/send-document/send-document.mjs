import documenso from "../../documenso.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "documenso-send-document",
  name: "Send Document",
  description: "Send a document within Documenso for signing",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    documenso,
    documentId: {
      propDefinition: [
        documenso,
        "documentId",
      ],
    },
    recipientDetails: {
      propDefinition: [
        documenso,
        "recipientDetails",
      ],
      optional: true,
    },
    emailContent: {
      propDefinition: [
        documenso,
        "emailContent",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.documenso.sendDocumentForSigning({
      documentId: this.documentId,
      recipientDetails: this.recipientDetails,
      emailContent: this.emailContent,
    });
    $.export("$summary", `Document with ID ${this.documentId} sent successfully.`);
    return response;
  },
};
