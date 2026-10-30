import app from "../../pdfgate.app.mjs";
import {
  DOCS_URLS, PROCESS_TIMEOUT_MS,
} from "../../common/constants.mjs";
import {
  buildCommonFields, omitBlank,
} from "../../common/utils.mjs";

export default {
  key: "pdfgate-compress-pdf",
  name: "Compress PDF",
  description: `Reduce the file size of a stored PDF without changing its visual content and save the result as a new PDFGate document. Use it before emailing or archiving large files; the original document is left unchanged. [See the documentation](${DOCS_URLS.compressPdf})`,
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
    linearize: {
      type: "boolean",
      label: "Linearize",
      description: "If `true`, optimises the PDF for fast web viewing so pages appear before the whole file has downloaded. Example: `true`.",
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
    const response = await this.app.compressPdf({
      $,
      data: {
        documentId: this.documentId,
        jsonResponse: true,
        ...omitBlank({
          linearize: this.linearize,
        }),
        ...buildCommonFields(this),
      },
      timeout: PROCESS_TIMEOUT_MS,
    });
    $.export("$summary", `Successfully compressed document ${this.documentId} into document ${response.id}`);
    return response;
  },
};
