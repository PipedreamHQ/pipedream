import diffchecker from "../../diffchecker.app.mjs";

export default {
  key: "diffchecker-compare-text",
  name: "Compare Text",
  description: "Compares two pieces of text and returns the result. [See the documentation](https://www.diffchecker.com/public-api/)",
  version: "1.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
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
      optional: true,
    },
    leftText: {
      type: "string",
      label: "Left Text",
      description: "Left text you want to compare.",
    },
    rightText: {
      type: "string",
      label: "Right Text",
      description: "Right text you want to compare.",
    },
  },
  async run({ $ }) {
    const response = await this.diffchecker.compareText({
      params: {
        output_type: this.outputType,
        diff_level: this.diffLevel,
      },
      data: {
        left: this.leftText,
        right: this.rightText,
      },
    });
    $.export("$summary", "Successfully compared texts");
    return response;
  },
};
