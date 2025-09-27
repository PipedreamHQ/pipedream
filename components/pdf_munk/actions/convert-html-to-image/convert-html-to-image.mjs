import app from "../../pdf_munk.app.mjs";

export default {
  key: "pdf_munk-convert-html-to-image",
  name: "Convert HTML to Image",
  description: "Converts HTML/CSS content to an image. [See documentation](https://pdfmunk.com/api-docs#:~:text=Image%20Generation)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    html_content: {
      type: "string",
      label: "HTML Content",
      description: "The HTML content to convert to an image",
    },
    css_content: {
      type: "string",
      label: "CSS Content",
      description: "The CSS content to style the HTML",
      optional: true,
    },
    width: {
      type: "integer",
      label: "Width",
      description: "The width of the generated image in pixels",
      default: 800,
    },
    height: {
      type: "integer",
      label: "Height",
      description: "The height of the generated image in pixels",
      default: 600,
    },
  },
  async run({ $ }) {
    const {
      html_content,
      css_content,
      width,
      height,
    } = this;

    const response = await this.app.convertHtmlToImage({
      $,
      html_content,
      css_content,
      width,
      height,
    });

    $.export("$summary", "Successfully converted HTML to image");
    return response;
  },
};
