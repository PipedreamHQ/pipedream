import app from "../../pdfgate.app.mjs";
import {
  DOCS_URLS, PROCESS_TIMEOUT_MS,
} from "../../common/constants.mjs";
import {
  buildCommonFields, omitBlank,
} from "../../common/utils.mjs";

export default {
  key: "pdfgate-flatten-pdf",
  name: "Flatten PDF",
  description: `Convert the interactive form fields of a stored PDF into static page content and save the result as a new PDFGate document. Use it to lock in filled values before archiving or sharing; the original document is left unchanged. [See the documentation](${DOCS_URLS.flattenPdf})`,
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
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
    fieldNames: {
      type: "string[]",
      label: "Field Names",
      description: "Names of the form fields to flatten, e.g. `[\"fullName\", \"email\"]`. Empty flattens every field. Use **Extract PDF Form Data** to list the field names of a document.",
      optional: true,
    },
    preSignedUrlExpiresIn: {
      propDefinition: [
        app,
        "preSignedUrlExpiresIn",
      ],
    },
    metadata: {
      propDefinition: [
        app,
        "metadata",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.flattenPdf({
      $,
      data: {
        documentId: this.documentId,
        jsonResponse: true,
        ...omitBlank({
          fieldNames: this.fieldNames?.length
            ? this.fieldNames
            : undefined,
        }),
        ...buildCommonFields(this),
      },
      timeout: PROCESS_TIMEOUT_MS,
    });
    $.export("$summary", `Successfully flattened document ${this.documentId} into document ${response.id}`);
    return response;
  },
};
