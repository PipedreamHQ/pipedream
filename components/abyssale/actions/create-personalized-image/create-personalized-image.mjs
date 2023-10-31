import abyssale from "../../abyssale.app.mjs";

export default {
  key: "abyssale-create-personalized-image",
  name: "Create Personalized Image",
  description: "This action dynamically generates an image from a url. [See the documentation](https://developers.abyssale.com/dynamic-images/dynamic-image-generation-with-url)",
  version: "0.0.1",
  type: "action",
  props: {
    abyssale,
    templateId: {
      propDefinition: [
        abyssale,
        "templateId",
      ],
    },
    formatName: {
      propDefinition: [
        abyssale,
        "formatName",
        (c) => ({
          templateId: c.templateId,
        }),
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
    async generateImageFromUrl({
      templateId,
      elements,
      imageFileType,
      formatName,
    }) {
      return this.abyssale._makeRequest({
        method: "POST",
        path: `/img.abyssale.com/${templateId}/${formatName}`,
        data: {
          elements,
          image_file_type: imageFileType,
        },
      });
    },
  },
  async run({ $ }) {
    const response = await this.generateImageFromUrl({
      templateId: this.templateId,
      elements: this.elements,
      imageFileType: this.imageFileType,
      formatName: this.formatName,
    });
    $.export("$summary", "Successfully generated personalized image");
    return response;
  },
};
