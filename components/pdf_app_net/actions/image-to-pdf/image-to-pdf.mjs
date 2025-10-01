import pdfApp from "../../pdf_app_net.app.mjs";

export default {
  key: "pdf_app_net-image-to-pdf",
  name: "Image to PDF",
  description: "Convert an image from a URL to a PDF File with PDF-app.net. [See the documentation](https://pdf-app.net/apidocumentation)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    pdfApp,
    imageUrl: {
      type: "string",
      label: "Image URL",
      description: "The URL of an image file to convert",
    },
    fileName: {
      propDefinition: [
        pdfApp,
        "fileName",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.pdfApp.imageToPdf({
      $,
      data: {
        imageUrls: [
          this.imageUrl,
        ],
        async: false,
        fileName: this.fileName,
      },
    });
    $.export("$summary", "Successfully converted image to PDF File");
    return response;
  },
};
