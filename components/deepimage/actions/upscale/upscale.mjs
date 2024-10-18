import deepimage from "../../deepimage.app.mjs";

export default {
  key: "deepimage-upscale",
  name: "Upscale Image",
  description: "Upscales the provided image using Deep Image. [See the documentation](https://documentation.deep-image.ai/)",
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
    upscaleMultiplier: {
      propDefinition: [
        deepimage,
        "upscaleMultiplier",
      ],
    },
    generativeUpscale: {
      propDefinition: [
        deepimage,
        "generativeUpscale",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.deepimage.upscaleImage({
      image: this.image,
      upscaleMultiplier: this.upscaleMultiplier,
      generativeUpscale: this.generativeUpscale,
    });

    $.export("$summary", "Successfully upscaled the image");
    return response;
  },
};
