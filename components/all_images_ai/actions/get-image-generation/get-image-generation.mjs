import allImagesAi from "../../all_images_ai.app.mjs";

export default {
  key: "all_images_ai-get-image-generation",
  name: "Get Image Generation",
  description: "Retrieves a previously generated image using its unique ID.",
  version: "0.0.1",
  type: "action",
  props: {
    allImagesAi,
    imageId: {
      propDefinition: [
        allImagesAi,
        "imageId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.allImagesAi.getImage({
      $,
      imageId: this.imageId,
    });
    $.export("$summary", `Successfully retrieved image generation with ID: ${this.imageId}`);
    return response;
  },
};
