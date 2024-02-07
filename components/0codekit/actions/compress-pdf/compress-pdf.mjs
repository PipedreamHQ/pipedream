import { axios } from "@pipedream/platform";
import qrPdfApp from "../../qr_pdf_app.app.mjs";

export default {
  key: "0codekit-compress-pdf",
  name: "Compress PDF",
  description: "Compresses a PDF using the specified URL. User can optionally specify the 'quality' prop to adjust the compression level.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    qrPdfApp,
    pdfUrl: {
      propDefinition: [
        qrPdfApp,
        "pdfUrl",
      ],
    },
    quality: {
      propDefinition: [
        qrPdfApp,
        "quality",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const compressedPdfBytes = await this.qrPdfApp.compressPdf({
      pdfUrl: this.pdfUrl,
      quality: this.quality,
    });
    $.export("$summary", `Successfully compressed PDF of size ${compressedPdfBytes.length} bytes`);
    return compressedPdfBytes;
  },
};
