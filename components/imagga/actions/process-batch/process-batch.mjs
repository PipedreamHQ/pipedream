import imagga from "../../imagga.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "imagga-process-batch",
  name: "Process Batch of Images",
  description: "Analyzes a batch of images for categorization, tagging, or color extraction. [See the documentation](https://docs.imagga.com/)",
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
    imageUrls: {
      propDefinition: [
        imagga,
        "imageUrls",
      ],
    },
    callbackUrl: {
      propDefinition: [
        imagga,
        "callbackUrl",
        (c) => ({
          optional: true,
        }),
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.imagga.analyzeBatch({
      imageUrls: this.imageUrls,
      imageProcessType: this.imageProcessType,
      callbackUrl: this.callbackUrl,
    });
    $.export("$summary", `Successfully submitted batch for ${this.imageProcessType} analysis`);
    return response;
  },
};
