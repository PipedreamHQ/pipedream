import templated from "../../templated.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "templated-create-render",
  name: "Create Render",
  description: "Creates a render on a template in Templated. [See the documentation](https://app.templated.io/docs#create-render)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    templated,
    apiKey: {
      propDefinition: [
        templated,
        "apiKey",
      ],
    },
    templateId: {
      propDefinition: [
        templated,
        "templateId",
      ],
    },
    layerChanges: {
      propDefinition: [
        templated,
        "layerChanges",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.templated.createRender({
      templateId: this.templateId,
      layerChanges: this.layerChanges,
    });

    $.export("$summary", `Successfully created render for template ID ${this.templateId}`);
    return response;
  },
};
