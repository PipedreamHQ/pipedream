import pixelpanda from "../../pixelpanda.app.mjs";
import {
  imageBody, parseStrength,
} from "../../common/utils.mjs";

export default {
  key: "pixelpanda-edit-image",
  name: "Edit Image With Prompt",
  description: "Transform an image with a text prompt using FLUX Kontext Pro — use it to restyle, recolor, or replace parts of an existing image rather than to generate one from scratch. Supply the source as either **Image URL** (publicly reachable) or **Image Base64**, not both. **Strength** accepts `0.0` (subtle) to `1.0` (strong) and defaults to `0.75`; values outside that range are rejected. Costs 2 credits per run. [See the documentation](https://pixelpanda.ai/developers)",
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
          ? parseStrength(this.strength)
          : undefined,
      },
    });
    $.export("$summary", `Image edited (credits remaining: ${response.credits_remaining})`);
    return response;
  },
};
