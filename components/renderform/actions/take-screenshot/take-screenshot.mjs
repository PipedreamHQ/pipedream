import renderform from "../../renderform.app.mjs";

export default {
  key: "renderform-take-screenshot",
  name: "Take Screenshot",
  description: "Capture an image of the current screen. [See the documentation](https://renderform.io/docs/api/take-screenshots)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    renderform,
    url: {
      type: "string",
      label: "URL",
      description: "The website URL of which RenderForm should take a screenshot",
    },
    height: {
      type: "integer",
      label: "Height",
      description: "The height of the screenshot in pixels",
    },
    width: {
      type: "integer",
      label: "Width",
      description: "The width of the screenshot in pixels",
    },
  },
  async run({ $ }) {
    const response = await this.renderform.captureImage({
      url: this.url,
      height: this.height,
      width: this.width,
    });

    $.export("$summary", `Captured a screenshot in format ${this.imageFormat}`);
    return response;
  },
};
