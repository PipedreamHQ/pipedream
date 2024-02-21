import templated from "../../templated.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "templated-list-template-layers",
  name: "List Template Layers",
  description: "Lists all layers of a template. [See the documentation](https://app.templated.io/docs#list-template-layers)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    templated,
    templateId: {
      propDefinition: [
        templated,
        "templateId",
      ],
    },
  },
  async run({ $ }) {
    const layers = await this.templated.listTemplateLayers({
      templateId: this.templateId,
    });
    $.export("$summary", `Listed ${layers.length} layers for template ID ${this.templateId}`);
    return layers;
  },
};
