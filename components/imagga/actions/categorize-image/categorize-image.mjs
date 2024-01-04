import imagga from "../../imagga.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "imagga-categorize-image",
  name: "Categorize Image",
  description: "Assign a category to a single image based on its visual content. [See the documentation](https://docs.imagga.com)",
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
      ],
    },
    imageFile: {
      propDefinition: [
        imagga,
        "imageFile",
      ],
    },
    categorizerId: {
      propDefinition: [
        imagga,
        "categorizerId",
        (c) => ({
          categorizerId: c.categorizerId,
        }),
      ],
      async options({ page }) {
        const response = await this.imagga.listCategorizers();
        const { categorizers } = response;
        return categorizers.map((categorizer) => ({
          label: categorizer.name,
          value: categorizer.id,
        }));
      },
    },
    callbackUrl: {
      propDefinition: [
        imagga,
        "callbackUrl",
      ],
    },
  },
  async run({ $ }) {
    if (!this.imageUrl && !this.imageFile) {
      throw new Error("Please provide either an Image URL or an Image File.");
    }

    let response;
    const imageProcessType = this.imageProcessType;
    switch (imageProcessType) {
    case "categories":
      response = await this.imagga.assignCategory({
        imageUrl: this.imageUrl,
        categorizerId: this.categorizerId,
        callbackUrl: this.callbackUrl,
      });
      break;
    case "tags":
    case "colors":
      response = await this.imagga.analyzeImage({
        imageProcessType: this.imageProcessType,
        imageUrl: this.imageUrl,
        imageFile: this.imageFile,
      });
      break;
    default:
      throw new Error(`Unsupported image process type: ${imageProcessType}`);
    }

    const summary = `Successfully processed the image with process type ${imageProcessType}`;
    $.export("$summary", summary);
    return response;
  },
};
