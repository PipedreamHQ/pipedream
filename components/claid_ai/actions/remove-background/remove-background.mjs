import claidAi from "../../claid_ai.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "claid_ai-remove-background",
  name: "Remove Background",
  description: "Easily erases the image's background, effectively isolating the main subject. [See the documentation]()", // Placeholder for docs link
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    claidAi,
    image: claidAi.propDefinitions.image,
    hdr: {
      ...claidAi.propDefinitions.hdr,
      default: false,
    },
    removeBackground: {
      ...claidAi.propDefinitions.removeBackground,
      default: true,
    },
    upscale: {
      ...claidAi.propDefinitions.upscale,
      default: false,
    },
  },
  async run({ $ }) {
    const operations = [
      {
        operation: "remove_background",
      },
      {
        operation: "hdr",
        active: this.hdr,
      },
      {
        operation: "upscale",
        active: this.upscale,
      },
    ].filter((op) => op.active !== false); // Ensures only active operations are included

    const response = await this.claidAi.editImage({
      image: this.image,
      operations,
    });

    $.export("$summary", "Successfully removed the background from the image");
    return response;
  },
};
