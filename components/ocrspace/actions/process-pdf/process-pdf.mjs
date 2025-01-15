import ocrspace from "../../ocrspace.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "ocrspace-process-pdf",
  name: "Process PDF for OCR",
  description: "Submit a PDF for OCR processing. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    ocrspace: {
      type: "app",
      app: "ocrspace",
    },
    pdfUrl: {
      propDefinition: [
        ocrspace,
        "pdfUrl",
      ],
    },
    pdfFile: {
      propDefinition: [
        ocrspace,
        "pdfFile",
      ],
    },
    pdfLanguage: {
      propDefinition: [
        ocrspace,
        "pdfLanguage",
      ],
      optional: true,
    },
    pdfPages: {
      propDefinition: [
        ocrspace,
        "pdfPages",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.ocrspace.submitPdf({
      pdfUrl: this.pdfUrl,
      pdfFile: this.pdfFile,
      pdfLanguage: this.pdfLanguage,
      pdfPages: this.pdfPages,
    });

    const jobId = response.JobId || response.jobId || "N/A";
    $.export("$summary", `Submitted PDF for OCR processing. Job ID: ${jobId}`);
    return response;
  },
};
