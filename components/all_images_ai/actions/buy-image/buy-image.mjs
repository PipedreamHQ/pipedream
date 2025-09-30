import allImagesAi from "../../all_images_ai.app.mjs";

export default {
  key: "all_images_ai-buy-image",
  name: "Buy Image",
  description: "Allows user to purchase an image and receive a direct public link. User must have sufficient credit balance. [See the documentation](https://developer.all-images.ai/all-images.ai-api/api-reference/images#buy-image-return-direct-url)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
    const response = await this.allImagesAi.purchaseImage({
      $,
      data: {
        id: this.imageId,
      },
    });

    $.export("$summary", `Successfully purchased image. Public link: ${response.url}`);
    return response;
  },
};
