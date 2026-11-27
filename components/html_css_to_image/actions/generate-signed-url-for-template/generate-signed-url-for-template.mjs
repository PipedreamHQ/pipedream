import htmlCssToImageApp from "../../html_css_to_image.app.mjs";
import { templateClientProps } from "../../common/rendering-props.mjs";
import { templateParameters } from "../../common/generated-props.mjs";
import {
  buildRenderingOptions,
  validateTemplateValues,
} from "../../common/utils.mjs";

export default {
  key: "html_css_to_image-generate-signed-url-for-template",
  name: "Generate Signed URL for Template",
  description: "Generate a signed URL locally for a saved template with dynamic values. Returns only the URL. This action does not create or render an image, make an API request, or consume image credits. The image is generated when the URL is first requested. Use **List Templates** to find a template ID and latest version. Use **Create Image From Template** for a create-then-fetch workflow. [See the documentation](https://docs.htmlcsstoimage.com/getting-started/create-and-render/#creating-a-templated-image-url)",
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
    ...templateClientProps,
  },
  async run({ $ }) {
    validateTemplateValues(this.templateValues);
    const url = this.htmlCssToImageApp.generateSignedUrlForTemplate(
      buildRenderingOptions(this, templateParameters),
    );
    $.export("$summary", "Signed URL generated. Image rendering has not been requested.");
    return {
      url,
    };
  },
};
