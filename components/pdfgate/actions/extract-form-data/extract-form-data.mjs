import app from "../../pdfgate.app.mjs";
import { DOCS_URLS } from "../../common/constants.mjs";

export default {
  key: "pdfgate-extract-form-data",
  name: "Extract PDF Form Data",
  description: `Read the form field values of a stored fillable PDF and return them as a JSON object keyed by field name, e.g. \`{"fullName":"Jane Doe","agree":true}\`. Use it to pull submitted data out of a filled form, or to discover the field names to pass to **Flatten PDF**. [See the documentation](${DOCS_URLS.extractFormData})`,
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
