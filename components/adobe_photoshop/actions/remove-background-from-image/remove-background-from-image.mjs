import adobePhotoshop from "../../adobe_photoshop.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "adobe_photoshop-remove-background-from-image",
  name: "Remove Background from Image",
  description: "Removes the background from an image using Adobe Photoshop API. [See the documentation](https://developer.adobe.com/photoshop/api/photoshop_removebackground/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    adobePhotoshop,
    imageUrl: {
      propDefinition: [
        adobePhotoshop,
        "imageUrl",
      ],
    },
    outputFormat: {
      propDefinition: [
        adobePhotoshop,
        "outputFormat",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.adobePhotoshop.removeBackground({
      imageUrl: this.imageUrl,
      outputFormat: this.outputFormat,
    });

    $.export("$summary", "Successfully removed background from the image");
    return response;
  },
};
