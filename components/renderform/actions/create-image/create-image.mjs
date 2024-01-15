import renderform from "../../renderform.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "renderform-create-image",
  name: "Create Image with Template",
  description: "Generates an image using a supplied template. [See the documentation](https://renderform.io/docs/api/get-started/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    renderform,
    template: {
      propDefinition: [
        renderform,
        "template",
      ],
    },
    templateVariables: {
      propDefinition: [
        renderform,
        "templateVariables",
        (c) => ({
          template: c.template,
        }),
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.renderform.generateImage({
      template: this.template,
      templateVariables: this.templateVariables,
    });

    $.export("$summary", `Image created using template ${this.template}`);
    return response;
  },
};
