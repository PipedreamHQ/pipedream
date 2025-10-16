import app from "../../templated.app.mjs";

export default {
  key: "templated-create-render",
  name: "Create Render",
  description: "Creates a render on a template in Templated. [See the documentation](https://app.templated.io/docs#create-render)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
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
    layers: {
      label: "Layers",
      description: "An object of layers that will be updated in the template. E.g. { \"text-1\" : { \"text\" : \"This is my text to be rendered\", \"color\" : \"#FFFFFF\", \"background\" : \"#0000FF\" }, \"image-1\": { \"image_url\" : \"https://pathtomyphoto.com/123.jpg\" } }",
      type: "object",
    },
  },
  async run({ $ }) {
    const layers = typeof this.layers === "string"
      ? JSON.parse(this.layers)
      : this.layers;

    const response = await this.app.createRender({
      $,
      data: {
        template: this.templateId,
        layers,
      },
    });

    $.export("$summary", `Successfully created render for template ID ${this.templateId}`);

    return response;
  },
};
