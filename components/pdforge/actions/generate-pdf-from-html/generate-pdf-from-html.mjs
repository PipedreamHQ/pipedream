import pdforge from "../../pdforge.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "pdforge-generate-pdf-from-html",
  name: "Generate PDF from HTML",
  description: "Generate a PDF document from HTML content. [See the documentation](https://docs.pdforge.com)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    pdforge,
    html: {
      propDefinition: [
        pdforge,
        "html",
      ],
    },
    pdfParams: {
      propDefinition: [
        pdforge,
        "pdfParams",
      ],
      optional: true,
    },
    convertToImage: {
      propDefinition: [
        pdforge,
        "convertToImage",
      ],
      optional: true,
    },
    s3bucket: {
      propDefinition: [
        pdforge,
        "s3bucket",
      ],
      optional: true,
    },
    s3key: {
      propDefinition: [
        pdforge,
        "s3key",
      ],
      optional: true,
    },
    webhook: {
      propDefinition: [
        pdforge,
        "webhook",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.pdforge.generatePDFfromHTML({
      html: this.html,
      pdfParams: this.pdfParams,
      convertToImage: this.convertToImage,
      s3bucket: this.s3bucket,
      s3key: this.s3key,
      webhook: this.webhook,
    });

    const summary = this.webhook
      ? `PDF generation initiated with request ID: ${response.requestId}.`
      : `PDF generated successfully. Download it using signed URL: ${response.signedUrl}.`;

    $.export("$summary", summary);
    return response;
  },
};
