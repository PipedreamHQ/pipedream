import htmlToImage from "../../html_to_image.app.mjs";

export default {
  key: "html_to_image-convert-url-to-image",
  name: "Convert URL to Image",
  description: "Capture a screenshot from a URL. [See the documentation](https://docs.htmlcsstoimg.com/html-to-image-api/screenshot-capture-api).",
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
    viewPortWidth: {
      type: "integer",
      label: "View Port Width",
      description: "Width of View Port. Default value is 1080",
      optional: true,
    },
    viewPortHeight: {
      type: "integer",
      label: "View Port Height",
      description: "Height of View Port. Default value is 720",
      optional: true,
    },
    quality: {
      propDefinition: [
        htmlToImage,
        "quality",
      ],
    },
    fullPage: {
      type: "boolean",
      label: "Full Page",
      description: "Whether to capture full-page screenshot of the URL. Default value is `false`.",
      optional: true,
    },
    waitUntil: {
      propDefinition: [
        htmlToImage,
        "waitUntil",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.htmlToImage.convertToImage({
      $,
      data: {
        url: this.url,
        viewPortWidth: this.viewPortWidth,
        viewPortHeight: this.viewPortHeight,
        quality: this.quality,
        full_page: this.fullPage,
        wait_till: this.waitUntil,
        generate_img_url: true,
      },
    });
    $.export("$summary", "Successfully converted URL to image");
    return response;
  },
};
