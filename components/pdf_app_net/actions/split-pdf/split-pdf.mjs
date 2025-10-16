import pdfApp from "../../pdf_app_net.app.mjs";

export default {
  key: "pdf_app_net-split-pdf",
  name: "Split PDF",
  description: "Split a PDF into multiple PDFs containing the specified number of pages. [See the documentation](https://pdf-app.net/apidocumentation)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    pdfApp,
    fileUrl: {
      type: "string",
      label: "File URL",
      description: "The URL of a .pdf file to split",
    },
    pagesPerSplit: {
      type: "integer",
      label: "Pages",
      description: "Each PDF will contain the specified number of pages. For instance, if the original PDF contains 6 pages, and `Pages` is `2`, the result will be 3 files, each containing 2 pages.",
    },
    fileName: {
      propDefinition: [
        pdfApp,
        "fileName",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.pdfApp.splitPdf({
      $,
      data: {
        fileUrl: this.fileUrl,
        pagesPerSplit: this.pagesPerSplit,
        async: false,
        fileName: this.fileName,
      },
    });
    $.export("$summary", "Successfully split PDF File");
    return response;
  },
};
