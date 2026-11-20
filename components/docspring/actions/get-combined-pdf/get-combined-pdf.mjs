import docspring from "../../docspring.app.mjs";

export default {
  key: "docspring-get-combined-pdf",
  name: "Get Combined PDF",
  description: "Get a combined PDF with its state, sources and file. Its links are in `files.pdf` once `state` is `processed`."
    + " Use it after **Combine PDFs**."
    + " [See the documentation](https://docspring.com/docs/api/#tag/combined-pdfs/get/combined_pdfs/{combined_pdf_id})",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    docspring,
    combinedPdfId: {
      propDefinition: [
        docspring,
        "combinedPdfId",
      ],
    },
  },
  async run({ $ }) {
    const combinedPdf = await this.docspring.getCombinedPdf({
      $,
      combinedPdfId: this.combinedPdfId,
    });
    $.export("$summary", `Combined PDF ${combinedPdf.id} is ${combinedPdf.state}`);
    return combinedPdf;
  },
};
