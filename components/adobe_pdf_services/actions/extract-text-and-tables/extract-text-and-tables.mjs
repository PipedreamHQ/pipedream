import adobe from "../../adobe_pdf_services.app.mjs";

export default {
  key: "adobe_pdf_services-extract-text-and-tables",
  name: "Extract Text and Tables From PDF",
  description: "Extracts text and table element information from a PDF document and returns a JSON file along with table data in XLSX format within a .zip file saved to the `/tmp` directory. [See the documentation](https://developer.adobe.com/document-services/docs/overview/pdf-extract-api/howtos/extract-api/#extract-text-and-tables)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
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
    syncDir: {
      type: "dir",
      accessMode: "read-write",
      sync: true,
    },
  },
  async run({ $ }) {
    await this.adobe.extractPDF(this.filePath, "tables", this.filename);
    $.export("$summary", "Successfully extracted text and tables from pdf file.");
    return `/tmp/${this.filename.includes(".zip")
      ? this.filename
      : this.filename + ".zip"}`;
  },
};
