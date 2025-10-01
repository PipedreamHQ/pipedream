import renderform from "../../renderform.app.mjs";

export default {
  key: "renderform-create-image",
  name: "Create Image with Template",
  description: "Generates an image using a supplied template. [See the documentation](https://renderform.io/docs/api/render-image-v1/)",
  version: "0.0.8",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
    const templateVariables = typeof this.templateVariables === "string"
      ? JSON.parse(this.templateVariables)
      : this.templateVariables;

    const response = await this.renderform.generateImage({
      $,
      data: {
        template: this.template,
        data: templateVariables,
      },
    });

    $.export("$summary", `Successfully created image using template ${this.template}`);
    return response;
  },
};
