import app from "../../pdfgate.app.mjs";
import { DOCS_URLS } from "../../common/constants.mjs";
import { omitBlank } from "../../common/utils.mjs";

export default {
  key: "pdfgate-get-document",
  name: "Get Document",
  description: `Retrieve a stored PDFGate document by ID: its status, type, metadata and, when **Pre-Signed URL Expiry** is set, a temporary \`fileUrl\` download link. Use it to fetch a fresh download link for a document created earlier. [See the documentation](${DOCS_URLS.getDocument})`,
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    documentId: {
      propDefinition: [
        app,
        "documentId",
      ],
    },
    preSignedUrlExpiresIn: {
      propDefinition: [
        app,
        "preSignedUrlExpiresIn",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getDocument({
      $,
      documentId: this.documentId,
      params: omitBlank({
        preSignedUrlExpiresIn: this.preSignedUrlExpiresIn,
      }),
    });
    $.export("$summary", `Successfully retrieved document ${this.documentId}`);
    return response;
  },
};
