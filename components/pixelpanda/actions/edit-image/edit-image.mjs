import pixelpanda from "../../pixelpanda.app.mjs";
import { imageBody } from "../../common/utils.mjs";

export default {
  key: "pixelpanda-edit-image",
  name: "Edit Image With Prompt",
  description: "Transform an image with a text prompt (FLUX Kontext Pro). 2 credits. [See the documentation](https://pixelpanda.ai/developers)",
  version: "0.1.0",
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
    prompt: {
      type: "string",
      label: "Prompt",
      description: "What to change, e.g. `make the background a beach at sunset`",
    },
    strength: {
      type: "string",
      label: "Strength",
      description: "Edit strength between `0.0` (subtle) and `1.0` (strong). Default `0.75`",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.pixelpanda.editImage({
      $,
      data: {
        ...imageBody(this),
        prompt: this.prompt,
        strength: this.strength
          ? parseFloat(this.strength)
          : undefined,
      },
    });
    $.export("$summary", `Image edited (credits remaining: ${response.credits_remaining})`);
    return response;
  },
};
