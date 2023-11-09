import { axios } from "@pipedream/platform";
import diffchecker from "../../diffchecker.app.mjs";

export default {
  key: "diffchecker-compare-image",
  name: "Compare Image",
  description: "Compares two images and returns the result.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    diffchecker,
    outputType: {
      propDefinition: [
        diffchecker,
        "outputType"
      ]
    },
    leftImage: {
      propDefinition: [
        diffchecker,
        "leftImage"
      ]
    },
    rightImage: {
      propDefinition: [
        diffchecker,
        "rightImage"
      ]
    },
  },
  async run({ $ }) {
    const response = await this.diffchecker.compareImages({
      outputType: this.outputType,
      leftImage: this.leftImage,
      rightImage: this.rightImage,
    });
    $.export("$summary", "Successfully compared images");
    return response;
  },
};