import imagga from "../../imagga.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "imagga-analyze-image",
  name: "Analyze Image",
  description: "Analyze a single image for visual content such as tags, categories, and colors. [See the documentation](https://docs.imagga.com)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    imagga,
    imageProcessType: {
      propDefinition: [
        imagga,
        "imageProcessType",
      ],
    },
    imageUrl: {
      propDefinition: [
        imagga,
        "imageUrl",
        (c) => ({
          optional: true,
        }),
      ],
    },
    imageFile: {
      propDefinition: [
        imagga,
        "imageFile",
        (c) => ({
          optional: true,
        }),
      ],
    },
  },
  async run({ $ }) {
    if (!this.imageUrl && !this.imageFile) {
      throw new Error("You must provide either an Image URL or an Image File.");
    }

    const response = await this.imagga.analyzeImage({
      imageProcessType: this.imageProcessType,
      imageUrl: this.imageUrl,
      imageFile: this.imageFile,
    });

    $.export("$summary", `Analyzed image for ${this.imageProcessType}`);
    return response;
  },
};
