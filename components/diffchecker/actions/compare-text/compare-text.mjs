import diffchecker from "../../diffchecker.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "diffchecker-compare-text",
  name: "Compare Text",
  description: "Compares two pieces of text and returns the result. [See the documentation](https://www.diffchecker.com/public-api/)",
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
    diffLevel: {
      propDefinition: [
        diffchecker,
        "diffLevel",
      ],
    },
    leftText: {
      propDefinition: [
        diffchecker,
        "leftText",
      ],
    },
    rightText: {
      propDefinition: [
        diffchecker,
        "rightText",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.diffchecker.compareText({
      outputType: this.outputType,
      diffLevel: this.diffLevel,
      leftText: this.leftText,
      rightText: this.rightText,
    });

    $.export("$summary", `Compared texts with output type: ${this.outputType}`);
    return response;
  },
};
