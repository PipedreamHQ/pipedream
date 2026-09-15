import pixelpanda from "../../pixelpanda.app.mjs";
import { imageBody } from "../../common/utils.mjs";

export default {
  key: "pixelpanda-remove-background",
  name: "Remove Background",
  description: "Remove the background from an image, returning a transparent PNG. 1 credit. [See the documentation](https://pixelpanda.ai/developers)",
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
    const response = await this.pixelpanda.removeBackground({
      $,
      data: imageBody(this),
    });
    $.export("$summary", `Background removed (credits remaining: ${response.credits_remaining})`);
    return response;
  },
};
