import app from "../../pdfgate.app.mjs";
import {
  DOCS_URLS, PROCESS_TIMEOUT_MS,
} from "../../common/constants.mjs";
import { buildCommonFields } from "../../common/utils.mjs";

export default {
  key: "pdfgate-upload-file",
  name: "Upload File",
  description: `Fetch a PDF from a public URL and store it as a PDFGate document. Use it to bring an existing file in so that **Compress PDF**, **Flatten PDF**, **Watermark PDF**, **Protect PDF**, **Extract PDF Form Data** and **Create Envelope** can reference its \`id\`. [See the documentation](${DOCS_URLS.uploadFile})`,
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
    url: {
      type: "string",
      label: "File URL",
      description: "Publicly reachable URL of the PDF to upload, e.g. `https://example.com/files/contract.pdf`. Map it from a file-upload trigger or from Google Drive, Dropbox or S3 steps that return a URL. PDFGate downloads and stores the file so later steps such as **Flatten PDF**, **Watermark PDF**, **Protect PDF**, **Compress PDF** and **Create Envelope** can reuse it.",
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
