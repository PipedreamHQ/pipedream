import htmlCssToImageApp from "../../html_css_to_image.app.mjs";
import { htmlClientProps } from "../../common/rendering-props.mjs";
import { buildRenderingOptions } from "../../common/utils.mjs";
import { htmlParameters } from "../../common/generated-props.mjs";

export default {
  key: "html_css_to_image-create-image-from-html",
  name: "Create Image From HTML",
  description: "Render HTML and CSS as an image or PDF and return its URL and metadata. Use **Create Image From Template** for saved templates. [See the documentation](https://docs.htmlcsstoimage.com/getting-started/using-the-api/#creating-an-image)",
  version: "0.1.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
  props: {
    htmlCssToImageApp,
    ...htmlClientProps,
  },
  async run({ $ }) {
    const {
      html,
      css,
    } = this;
    const result = await this.htmlCssToImageApp.createImageFromHTML(
      $, html, css, buildRenderingOptions(this, htmlParameters),
    );
    $.export("$summary", `Successfully created image ${result.id}`);
    return result;
  },
};
