import app from "../../pdfgate.app.mjs";
import { DOCS_URL } from "../../common/constants.mjs";

export default {
  key: "pdfgate-extract-form-data",
  name: "Extract PDF Form Data",
  description: `Extract form field values from a fillable PDF and return them as a JSON object. [See the documentation](${DOCS_URL})`,
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
  },
  async run({ $ }) {
    // Note: /forms/extract-data always returns JSON and does not accept `jsonResponse`.
    const response = await this.app.extractFormData({
      $,
      data: {
        documentId: this.documentId,
      },
    });
    $.export("$summary", `Successfully extracted form data from document ${this.documentId}`);
    return response;
  },
};
