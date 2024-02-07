import claidAi from "../../claid_ai.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "claid_ai-correct-color-lighting",
  name: "Correct Color & Lighting",
  description: "Automatically adjusts the color and lighting of an image by applying HDR. The result is an enhancement of the dynamic range in dark or overexposed images.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    claidAi,
    image: claidAi.propDefinitions.image,
    hdr: {
      ...claidAi.propDefinitions.hdr,
      default: true,
    },
    removeBackground: {
      ...claidAi.propDefinitions.removeBackground,
      optional: true,
    },
    upscale: {
      ...claidAi.propDefinitions.upscale,
      optional: true,
    },
  },
  async run({ $ }) {
    const operations = [];
    operations.push({
      operation: "hdr",
    }); // HDR is always applied

    if (this.removeBackground) {
      operations.push({
        operation: "remove_background",
      });
    }
    if (this.upscale) {
      operations.push({
        operation: "upscale",
      });
    }

    const response = await this.claidAi.editImage({
      image: this.image,
      operations,
    });

    $.export("$summary", "Successfully adjusted color and lighting");
    return response;
  },
};
