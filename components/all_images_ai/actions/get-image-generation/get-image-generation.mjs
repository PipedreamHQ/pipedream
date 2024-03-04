import allImagesAi from "../../all_images_ai.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "all_images_ai-get-image-generation",
  name: "Get Image Generation",
  description: "Retrieves a previously generated image using its unique ID.",
  version: "0.0.1",
  type: "action",
  props: {
    allImagesAi,
    imageId: {
      type: "string",
      label: "Image ID",
      description: "Enter the unique ID of the image.",
    },
  },
  async run({ $ }) {
    const response = await this.allImagesAi.getImage({
      imageId: this.imageId,
    });
    $.export("$summary", `Successfully retrieved image generation with ID: ${this.imageId}`);
    return response;
  },
};
