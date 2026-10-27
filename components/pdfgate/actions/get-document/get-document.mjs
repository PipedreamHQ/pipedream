import app from "../../pdfgate.app.mjs";
import { DOCS_URL } from "../../common/constants.mjs";
import { omitBlank } from "../../common/utils.mjs";

export default {
  key: "pdfgate-get-document",
  name: "Get Document",
  description: `Retrieve a stored PDFGate document by ID, including a pre-signed download URL. [See the documentation](${DOCS_URL})`,
  version: "0.0.1",
  type: "action",
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
