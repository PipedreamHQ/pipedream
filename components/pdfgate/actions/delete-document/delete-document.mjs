import app from "../../pdfgate.app.mjs";
import { DOCS_URLS } from "../../common/constants.mjs";

export default {
  key: "pdfgate-delete-document",
  name: "Delete Document",
  description: `Permanently delete a stored PDFGate document by ID. Use it to remove files you no longer need before their storage period ends; this cannot be undone and later reads of the ID fail. [See the documentation](${DOCS_URLS.deleteDocument})`,
  version: "0.0.1",
  type: "action",
  ai: "optimized",
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
