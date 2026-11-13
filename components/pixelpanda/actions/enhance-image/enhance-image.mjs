import pixelpanda from "../../pixelpanda.app.mjs";
import { imageBody } from "../../common/utils.mjs";

export default {
  key: "pixelpanda-enhance-image",
  name: "Enhance Image",
  description: "AI-enhance an image: fix blur, color, and sharpness. 1 credit. [See the documentation](https://pixelpanda.ai/developers)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    pixelpanda,
    imageUrl: {
      propDefinition: [
        pixelpanda,
        "imageUrl",
      ],
    },
    imageBase64: {
      propDefinition: [
        pixelpanda,
        "imageBase64",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.pixelpanda.enhanceImage({
      $,
      data: imageBody(this),
    });
    $.export("$summary", `Image enhanced (credits remaining: ${response.credits_remaining})`);
    return response;
  },
};
