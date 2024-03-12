import { axios } from "@pipedream/platform";
import html2Pdf from "../../html_2_pdf.app.mjs";

export default {
  key: "html_2_pdf-generate-pdf",
  name: "Generate PDF",
  description: "Creates a PDF from a URL or HTML string. [See the documentation](https://www.html2pdf.co.uk/api-documentation)",
  version: "0.0.1",
  type: "action",
  props: {
    html2Pdf,
    source: {
      propDefinition: [
        html2Pdf,
        "source",
      ],
    },
    content: {
      propDefinition: [
        html2Pdf,
        "content",
      ],
    },
    licenseKey: {
      propDefinition: [
        html2Pdf,
        "licenseKey",
      ],
    },
  },
  async run({ $ }) {
    const path = await this.html2Pdf.createPdf({
      source: this.source,
      content: this.content,
      licenseKey: this.licenseKey,
    });

    $.export("$summary", `Generated PDF is saved at ${path}`);
    return {
      path,
    };
  },
};
