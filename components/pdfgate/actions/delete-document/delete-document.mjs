import app from "../../pdfgate.app.mjs";
import { DOCS_URL } from "../../common/constants.mjs";

export default {
  key: "pdfgate-delete-document",
  name: "Delete Document",
  description: `Delete a stored PDFGate document by ID. [See the documentation](${DOCS_URL})`,
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    documentId: {
      propDefinition: [
        app,
        "documentId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.deleteDocument({
      $,
      documentId: this.documentId,
    });
    $.export("$summary", `Successfully deleted document ${this.documentId}`);
    return response ?? {
      id: this.documentId,
      deleted: true,
    };
  },
};
