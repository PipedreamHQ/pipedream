import htmlCssToImageApp from "../../html_css_to_image.app.mjs";
import { templateClientProps } from "../../common/rendering-props.mjs";
import { templateParameters } from "../../common/generated-props.mjs";
import {
  buildRenderingOptions,
  validateTemplateValues,
} from "../../common/utils.mjs";

export default {
  key: "html_css_to_image-create-image-from-template",
  name: "Create Image From Template",
  description: "Render a saved template with dynamic values and return its image or PDF URL and metadata. Use **List Templates** to find a template ID and latest version. Omit Template Version to use the latest version. [See the documentation](https://docs.htmlcsstoimage.com/getting-started/templates/#creating-an-image-with-a-template)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    htmlCssToImageApp,
    ...templateClientProps,
  },
  async run({ $ }) {
    validateTemplateValues(this.templateValues);
    const result = await this.htmlCssToImageApp.createImageFromTemplate(
      $, buildRenderingOptions(this, templateParameters),
    );
    $.export("$summary", `Successfully created image ${result.id} from a template`);
    return result;
  },
};
