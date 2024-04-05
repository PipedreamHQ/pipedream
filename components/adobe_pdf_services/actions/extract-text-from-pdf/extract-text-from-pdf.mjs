import adobe from "../../adobe_pdf_services.app.mjs";

export default {
  key: "adobe_pdf_services-extract-text-from-pdf",
  name: "Extract Text From PDF",
  description: "Extracts text element information from a PDF document and returns a JSON file within a .zip file saved to the `/tmp` directory. [See the documentation](https://developer.adobe.com/document-services/docs/overview/pdf-extract-api/howtos/extract-api/#extract-text-from-a-pdf)",
  version: "0.0.2",
  type: "action",
  props: {
    adobe,
    filePath: {
      propDefinition: [
        adobe,
        "filePath",
      ],
    },
    filename: {
      propDefinition: [
        adobe,
        "filename",
      ],
    },
  },
  async run({ $ }) {
    await this.adobe.extractPDF(this.filePath, "text", this.filename);
    $.export("$summary", "Successfully extracted text from pdf file.");
    return `/tmp/${this.filename.includes(".zip")
      ? this.filename
      : this.filename + ".zip"}`;
  },
};
