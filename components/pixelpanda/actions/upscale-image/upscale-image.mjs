import pixelpanda from "../../pixelpanda.app.mjs";
import { imageBody } from "../../common/utils.mjs";

export default {
  key: "pixelpanda-upscale-image",
  name: "Upscale Image",
  description: "AI-upscale an image 2x/4x (1 credit) or 8x (2 credits). [See the documentation](https://pixelpanda.ai/developers)",
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
    scale: {
      type: "integer",
      label: "Scale",
      description: "Upscale factor",
      options: [
        2,
        4,
        8,
      ],
      default: 4,
    },
    quality: {
      type: "string",
      label: "Quality",
      description: "Quality mode",
      options: [
        "fast",
        "balanced",
        "high",
      ],
      default: "balanced",
    },
  },
  async run({ $ }) {
    const response = await this.pixelpanda.upscaleImage({
      $,
      data: {
        ...imageBody(this),
        scale: this.scale,
        quality: this.quality,
      },
    });
    $.export("$summary", `Image upscaled ${this.scale}x (credits remaining: ${response.credits_remaining})`);
    return response;
  },
};
