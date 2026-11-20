import htmlCssToImageApp from "../../html_css_to_image.app.mjs";
import { signedUrlClientProps } from "../../common/rendering-props.mjs";
import { signedUrlParameters } from "../../common/generated-props.mjs";
import { buildRenderingOptions } from "../../common/utils.mjs";

export default {
  key: "html_css_to_image-generate-signed-url-for-webpage",
  name: "Generate Signed URL for Webpage",
  description: "Generate a signed URL locally for a webpage screenshot. Returns only the URL. This action does not create or render an image, make an API request, or consume image credits. The image is generated when the URL is first requested. Use **Create Image From URL** for a create-then-fetch workflow. [See the documentation](https://docs.htmlcsstoimage.com/getting-started/create-and-render/)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: false,
    readOnlyHint: true,
  },
  props: {
    htmlCssToImageApp,
    ...signedUrlClientProps,
  },
  async run({ $ }) {
    const url = this.htmlCssToImageApp.generateSignedUrlForWebpage(
      buildRenderingOptions(this, signedUrlParameters),
    );
    $.export("$summary", "Signed URL generated. Image rendering has not been requested.");
    return {
      url,
    };
  },
};
