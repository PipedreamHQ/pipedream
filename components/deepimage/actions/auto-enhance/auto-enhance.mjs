import deepimage from "../../deepimage.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "deepimage-auto-enhance",
  name: "Auto Enhance Image",
  description: "Improves the provided image. [See the documentation](https://documentation.deep-image.ai/image-processing/auto-enhance)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    deepimage,
    image: {
      propDefinition: [
        deepimage,
        "image",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.deepimage.improveImage({
      image: this.image,
    });

    $.export("$summary", "Successfully enhanced the image.");
    return response;
  },
};
