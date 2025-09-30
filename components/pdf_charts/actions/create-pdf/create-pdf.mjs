import pdfCharts from "../../pdf_charts.app.mjs";

export default {
  key: "pdf_charts-create-pdf",
  name: "Create PDF",
  description: "Create a PDF document using PDF Charts. [See the documentation](https://www.pdf-charts.com/playground)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
    alert: {
      type: "alert",
      alertType: "info",
      content: `Data Example: 
        \n\`{"day":"Monday","item1713508000534":{"title":{"x":"center","text":"Sample Bar Chart"},"xAxis":{"data":["Category 1","Category 2","Category 3","Category 4","Category 5"],"type":"category","axisTick":{"show":false} },"yAxis":{"type":"value"},"series":[{"data":[{"value":20},{"value":200},{"value":150},{"value":80},{"value":70}],"name":"Data","type":"bar"}]} }\`
        \n\n Note: To find the correct element id(s) (ex. item1713508000534), select the document in PDF Charts and click the edit icon.`,
    },
  },
  async run({ $ }) {
    const response = await this.pdfCharts.createPdf({
      $,
      data: {
        documentId: this.documentId,
        data: typeof this.data === "string"
          ? JSON.parse(this.data)
          : this.data,
        output: "json",
      },
    });
    $.export("$summary", `Successfully created PDF: ${response.signedUrl}`);
    return response;
  },
};
