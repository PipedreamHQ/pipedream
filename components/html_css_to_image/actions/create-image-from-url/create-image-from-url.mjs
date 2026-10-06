import htmlCssToImageApp from "../../html_css_to_image.app.mjs";
import { urlClientProps } from "../../common/rendering-props.mjs";
import { buildRenderingOptions } from "../../common/utils.mjs";
import { urlParameters } from "../../common/generated-props.mjs";

export default {
  key: "html_css_to_image-create-image-from-url",
  name: "Create Image From URL",
  description: "Capture a webpage as an image or PDF and return its URL and metadata. Supports full-page screenshots, injected CSS, and custom webpage headers. [See the documentation](https://docs.htmlcsstoimage.com/getting-started/using-the-api/#creating-an-image)",
  version: "0.1.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
  props: {
    htmlCssToImageApp,
    ...urlClientProps,
  },
  async run({ $ }) {
    const { url } = this;
    const result = await this.htmlCssToImageApp.createImageFromURL(
      $, url, buildRenderingOptions(this, urlParameters),
    );
    $.export("$summary", `Successfully created image ${result.id} from a webpage`);
    return result;
  },
};
