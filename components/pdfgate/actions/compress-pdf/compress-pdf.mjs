import app from "../../pdfgate.app.mjs";
import {
  DOCS_URL, PROCESS_TIMEOUT_MS,
} from "../../common/constants.mjs";
import {
  buildCommonFields, omitBlank,
} from "../../common/utils.mjs";

export default {
  key: "pdfgate-compress-pdf",
  name: "Compress PDF",
  description: `Compress a PDF to reduce its file size without changing visual content. [See the documentation](${DOCS_URL})`,
  version: "0.0.1",
  type: "action",
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
      description: "Makes the PDF load faster in the browser by letting pages appear before the whole file finishes downloading.",
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
