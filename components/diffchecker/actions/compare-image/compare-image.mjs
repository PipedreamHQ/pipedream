import diffchecker from "../../diffchecker.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "diffchecker-compare-image",
  name: "Compare Images",
  description: "Compares two images and returns the result. [See the documentation](https://www.diffchecker.com/public-api/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    diffchecker,
    outputType: {
      propDefinition: [
        diffchecker,
        "outputType",
      ],
    },
    leftImage: {
      propDefinition: [
        diffchecker,
        "leftImage",
      ],
    },
    rightImage: {
      propDefinition: [
        diffchecker,
        "rightImage",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.diffchecker.compareImages({
      outputType: this.outputType,
      leftImage: this.leftImage,
      rightImage: this.rightImage,
    });

    $.export("$summary", "Compared images successfully");
    return response;
  },
};
