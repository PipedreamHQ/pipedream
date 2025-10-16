import htmlToImage from "../../html_to_image.app.mjs";

export default {
  key: "html_to_image-convert-html-to-pdf",
  name: "Convert HTML to PDF",
  description: "Create a PDF file from HTML. [See the documentation](https://docs.htmlcsstoimg.com/html-to-image-api/html-css-to-pdf-api).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    htmlToImage,
    htmlContent: {
      propDefinition: [
        htmlToImage,
        "htmlContent",
      ],
    },
    cssContent: {
      propDefinition: [
        htmlToImage,
        "cssContent",
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
    preferCssPageSize: {
      type: "boolean",
      label: "Prefer CSS Page Size",
      description: "Get size from CSS styles. Default: `true`",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.htmlToImage.convertToPdf({
      $,
      data: {
        html_content: this.htmlContent,
        css_content: this.cssContent,
        paper_size: this.paperSize,
        landscape: this.landscape,
        displayHeaderFooter: this.displayHeaderFooter,
        printBackground: this.printBackground,
        preferCssPageSize: this.preferCssPageSize,
        generate_pdf_url: true,
      },
    });
    $.export("$summary", "Successfully converted HTML to PDF");
    return response;
  },
};
