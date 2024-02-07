import claidAi from "../../claid_ai.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "claid_ai-upscale-image",
  name: "Upscale Image",
  description: "Enlarges the selected image in order to improve its resolution. By running this action, users can obtain clearer and sharper images.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    claidAi,
    image: {
      propDefinition: [
        claidAi,
        "image",
      ],
    },
    upscale: {
      type: "boolean",
      label: "Upscale Image",
      description: "Enlarge the image to improve its resolution.",
      optional: true,
      default: true,
    },
    hdr: {
      propDefinition: [
        claidAi,
        "hdr",
        () => ({
          default: false,
        }),
      ],
    },
    removeBackground: {
      propDefinition: [
        claidAi,
        "removeBackground",
        () => ({
          default: false,
        }),
      ],
    },
  },
  async run({ $ }) {
    const operations = [];
    if (this.hdr) operations.push({
      operation: "hdr",
    });
    if (this.removeBackground) operations.push({
      operation: "remove_background",
    });
    if (this.upscale) operations.push({
      operation: "upscale",
    });

    const response = await this.claidAi.editImage({
      image: this.image,
      operations: operations.length > 0
        ? operations
        : undefined,
    });

    $.export("$summary", "Image successfully upscaled");
    return response;
  },
};
