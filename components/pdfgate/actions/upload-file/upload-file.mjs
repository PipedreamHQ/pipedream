import app from "../../pdfgate.app.mjs";
import {
  DOCS_URL, PROCESS_TIMEOUT_MS,
} from "../../common/constants.mjs";
import { buildCommonFields } from "../../common/utils.mjs";

export default {
  key: "pdfgate-upload-file",
  name: "Upload File",
  description: `Upload a PDF from a public URL so it can be used by other PDFGate operations. [See the documentation](${DOCS_URL})`,
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    url: {
      type: "string",
      label: "File URL",
      description: "Publicly accessible URL of the PDF to upload. You can map this from a file upload trigger, Google Drive, Dropbox, S3, or any previous step that returns a file URL. PDFGate fetches and stores the PDF so you can reuse it in later actions such as Flatten, Watermark, Protect, Compress and Create Envelope.",
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
    // Note: /upload always returns JSON and does not accept `jsonResponse`.
    const response = await this.app.uploadFile({
      $,
      data: {
        url: this.url,
        ...buildCommonFields(this),
      },
      timeout: PROCESS_TIMEOUT_MS,
    });
    $.export("$summary", `Successfully uploaded file as document ${response.id}`);
    return response;
  },
};
