import allImagesAi from "../../all_images_ai.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "all_images_ai-buy-image",
  name: "Buy Image",
  description: "Allows user to purchase an image and receive a direct public link. User must have sufficient credit balance.",
  version: "0.0.${ts}",
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
      imageId: this.imageId,
    });

    // Assuming the API returns a JSON object with a key `url` that contains the direct public link to the purchased image
    const publicLink = response.url;
    $.export("$summary", `Successfully purchased image. Public link: ${publicLink}`);
    return response;
  },
};
