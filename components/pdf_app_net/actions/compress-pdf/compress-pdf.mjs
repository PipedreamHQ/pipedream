import pdfApp from "../../pdf_app_net.app.mjs";

export default {
  key: "pdf_app_net-compress-pdf",
  name: "Compress PDF",
  description: "Compress a PDF File with PDF-app.net. [See the documentation](https://pdf-app.net/apidocumentation)",
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
      description: "The URL of a .pdf file to compress",
    },
    fileName: {
      propDefinition: [
        pdfApp,
        "fileName",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.pdfApp.compressPdf({
      $,
      data: {
        fileUrl: this.fileUrl,
        async: false,
        fileName: this.fileName,
      },
    });
    $.export("$summary", "Successfully compressed PDF File");
    return response;
  },
};
