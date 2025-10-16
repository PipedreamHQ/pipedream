import app from "../../templated.app.mjs";

export default {
  key: "templated-list-template-layers",
  name: "List Template Layers",
  description: "Lists all layers of a template. [See the documentation](https://app.templated.io/docs#list-template-layers)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    templateId: {
      propDefinition: [
        app,
        "templateId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.listTemplateLayers({
      $,
      id: this.templateId,
    });
    $.export("$summary", "Successfully listed layers for template");
    return response;
  },
};
