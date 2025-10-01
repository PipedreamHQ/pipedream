import htmlCssToImageApp from "../../html_css_to_image.app.mjs";

export default {
  key: "html_css_to_image-create-image-from-html",
  name: "Create Image From HTML",
  description: "Create Image From HTML. [See the docs](https://docs.htmlcsstoimage.com/getting-started/using-the-api/#creating-an-image).",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    htmlCssToImageApp,
    html: {
      propDefinition: [
        htmlCssToImageApp,
        "html",
      ],
    },
    css: {
      propDefinition: [
        htmlCssToImageApp,
        "css",
      ],
    },
  },
  async run({ $ }) {
    const {
      html,
      css,
    } = this;
    const result = await this.htmlCssToImageApp.createImageFromHTML($, html, css);
    $.export("$summary", "Successfully created an image");
    return result;
  },
};
