import abyssale from "../../abyssale.app.mjs";

export default {
  key: "abyssale-generate-image",
  name: "Generate Image",
  description: "Generates a single image from a template. [See the documentation](https://developers.abyssale.com/rest-api/generation/generate-a-single-image)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    abyssale,
    templateId: {
      propDefinition: [
        abyssale,
        "templateId",
      ],
    },
    elements: {
      propDefinition: [
        abyssale,
        "elements",
      ],
    },
    imageFileType: {
      propDefinition: [
        abyssale,
        "imageFileType",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.abyssale.generateSingleImage({
      templateId: this.templateId,
      elements: this.elements,
      imageFileType: this.imageFileType,
    });
    $.export("$summary", `Successfully generated image with ID: ${response.id}`);
    return response;
  },
};
