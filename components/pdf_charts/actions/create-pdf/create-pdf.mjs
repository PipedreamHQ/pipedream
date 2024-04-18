import pdfCharts from "../../pdf_charts.app.mjs";

export default {
  key: "pdf_charts-create-pdf",
  name: "Create PDF",
  description: "Create a PDF document using PDF Charts. [See the documentation](https://www.pdf-charts.com/playground)",
  version: "0.0.1",
  type: "action",
  props: {
    pdfCharts,
    documentId: {
      type: "string",
      label: "Document ID",
      description: "ID of the document for PDF creation",
    },
    data: {
      type: "object",
      label: "Data",
      description: "Values for elements in the document. See the PDF Charts [Playground](https://www.pdf-charts.com/playground) for example data.",
    },
  },
  async run({ $ }) {
    const response = await this.pdfCharts.createPdf({
      $,
      data: {
        documentId: this.documentId,
        data: this.data,
        output: "json",
      },
    });
    $.export("$summary", `Successfully created PDF: ${response.signedUrl}`);
    return response;
  },
};
