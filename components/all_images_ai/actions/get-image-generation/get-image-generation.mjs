import allImagesAi from "../../all_images_ai.app.mjs";

export default {
  key: "all_images_ai-get-image-generation",
  name: "Get Image Generation",
  description: "Retrieves a previously generated image using its unique ID. [See the documentation](https://developer.all-images.ai/all-images.ai-api/api-reference/images-generation#get-image-generation)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    allImagesAi,
    imageGenerationId: {
      propDefinition: [
        allImagesAi,
        "imageGenerationId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.allImagesAi.getImage({
      $,
      imageGenerationId: this.imageGenerationId,
    });
    $.export("$summary", `Successfully retrieved image generation with ID: ${this.imageGenerationId}`);
    return response;
  },
};
