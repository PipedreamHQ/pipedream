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
  methods: {
    async generateSingleImage({
      templateId, elements, imageFileType,
    }) {
      return this.abyssale._makeRequest({
        method: "POST",
        path: `/banner-builder/${templateId}/generate`,
        data: {
          elements,
          image_file_type: imageFileType,
        },
      });
    },
  },
  async run({ $ }) {
    const response = await this.generateSingleImage({
      templateId: this.templateId,
      elements: this.elements,
      imageFileType: this.imageFileType,
    });
    $.export("$summary", `Successfully generated image with ID: ${response.id}`);
    return response;
  },
};
