import htmlCssToImageApp from "../../html_css_to_image.app.mjs";

export default {
  key: "html_css_to_image-create-image-from-url",
  name: "Create Image From URL",
  description: "Create Image From URL. [See the docs](https://docs.htmlcsstoimage.com/getting-started/using-the-api/#creating-an-image).",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    htmlCssToImageApp,
    url: {
      propDefinition: [
        htmlCssToImageApp,
        "url",
      ],
    },
  },
  async run({ $ }) {
    const { url } = this;
    const result = await this.htmlCssToImageApp.createImageFromURL($, url);
    $.export("$summary", `Successfully created an image from: ${url}`);
    return result;
  },
};
