import mergemole from "../../mergemole.app.mjs";

export default {
  key: "mergemole-get-template-variables",
  name: "Get Template Variables",
  description: "Get all data variables of a specified template. [See the documentation](https://documenter.getpostman.com/view/41321603/2sB2j3AWqz#14da32c9-9b15-421e-89c9-8a977b04dc32)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    mergemole,
    templateId: {
      propDefinition: [
        mergemole,
        "templateId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.mergemole.getTemplateVariables({
      $,
      templateId: this.templateId,
    });
    $.export("$summary", `Successfully retrieved variables for template with ID: ${this.templateId}`);
    return response;
  },
};
