import imagior from "../../imagior.app.mjs";

export default {
  key: "imagior-generate-image",
  name: "Generate Image",
  description: "Generates a unique and robust image using a provided template.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    imagior,
    template_id: {
      propDefinition: [
        imagior,
        "template_id",
      ],
    },
    image_parameters: {
      propDefinition: [
        imagior,
        "image_parameters",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.imagior.generateImage({
      template_id: this.template_id,
      image_parameters: this.image_parameters,
    });
    $.export("$summary", "Successfully generated image");
    return response;
  },
};
