import { getUrlOrFile } from "../../common/utils.mjs";
import deepimage from "../../deepimage.app.mjs";

export default {
  key: "deepimage-upscale",
  name: "Upscale Image",
  description: "Upscales the provided image using Deep Image. [See the documentation](https://documentation.deep-image.ai/image-processing/resize-and-padding)",
  version: "0.1.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    deepimage,
    image: {
      propDefinition: [
        deepimage,
        "image",
      ],
    },
    upscaleMultiplier: {
      type: "integer",
      label: "Upscale Multiplier",
      description: "The factor by which to upscale the image in %.",
    },
    generativeUpscale: {
      type: "boolean",
      label: "Generative Upscale",
      description: "Whether to use generative upscale.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.deepimage.makeRequest({
      $,
      data: {
        url: await getUrlOrFile(this.image),
        width: `${this.upscaleMultiplier}%`,
        height: `${this.upscaleMultiplier}%`,
        generative_upscale: this.generativeUpscale,
      },
    });

    $.export("$summary", "Successfully upscaled the image");
    return response;
  },
};
