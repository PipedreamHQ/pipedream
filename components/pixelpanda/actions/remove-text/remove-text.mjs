import pixelpanda from "../../pixelpanda.app.mjs";
import { imageBody } from "../../common/utils.mjs";

export default {
  key: "pixelpanda-remove-text",
  name: "Remove Text",
  description: "Remove text and watermarks from an image. 1 credit. [See the documentation](https://pixelpanda.ai/developers)",
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
    const response = await this.pixelpanda.removeText({
      $,
      data: imageBody(this),
    });
    $.export("$summary", `Text removed (credits remaining: ${response.credits_remaining})`);
    return response;
  },
};
