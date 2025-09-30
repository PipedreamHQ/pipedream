import htmlToImage from "../../html_to_image.app.mjs";

export default {
  key: "html_to_image-convert-url-to-pdf",
  name: "Convert URL to PDF",
  description: "Create a PDF from a URL. [See the documentation](https://docs.htmlcsstoimg.com/html-to-image-api/url-to-pdf-api).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    htmlToImage,
    url: {
      propDefinition: [
        htmlToImage,
        "url",
      ],
    },
    paperSize: {
      propDefinition: [
        htmlToImage,
        "paperSize",
      ],
    },
    landscape: {
      propDefinition: [
        htmlToImage,
        "landscape",
      ],
    },
    displayHeaderFooter: {
      propDefinition: [
        htmlToImage,
        "displayHeaderFooter",
      ],
    },
    printBackground: {
      propDefinition: [
        htmlToImage,
        "printBackground",
      ],
    },
    waitUntil: {
      propDefinition: [
        htmlToImage,
        "waitUntil",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.htmlToImage.convertToPdf({
      $,
      data: {
        url: this.url,
        paper_size: this.paperSize,
        landscape: this.landscape,
        displayHeaderFooter: this.displayHeaderFooter,
        printBackground: this.printBackground,
        wait_till: this.waitUntil,
        generate_pdf_url: true,
      },
    });
    $.export("$summary", "Successfully converted URL to PDF");
    return response;
  },
};
