import htmlToImage from "../../html_to_image.app.mjs";

export default {
  key: "html_to_image-convert-html-to-image",
  name: "Convert HTML to Image",
  description: "Create an image from HTML. [See the documentation](https://docs.htmlcsstoimg.com/html-to-image-api/html-css-to-image-api).",
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
    font: {
      type: "string",
      label: "Font",
      description: "Google Font Name that needs to be imported when generating image from HTML & CSS. To pass multiple fonts, separate them with | sign. Example - `Roboto|Georgia`",
      optional: true,
    },
    quality: {
      propDefinition: [
        htmlToImage,
        "quality",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.htmlToImage.convertToImage({
      $,
      data: {
        html_content: this.htmlContent,
        css_content: this.cssContent,
        font: this.font,
        quality: this.quality,
        generate_img_url: true,
      },
    });
    $.export("$summary", "Successfully converted HTML to image");
    return response;
  },
};
