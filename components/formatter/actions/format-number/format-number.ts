import { defineAction } from "@pipedream/types";

export default defineAction({
  name: "[Numbers] Format Number",
  description:
    "Format a number to a new style. Does not perform any rounding or padding of the number.",
  key: "expofp-format-number",
  version: "0.0.1",
  type: "action",
  props: {
    input: {
      label: "Input",
      description: "Number string you would like to format.",
      type: "string",
    },
    inputDecimalMark: {
      label: "Input Decimal Mark",
      description:
        "The character the input uses to denote the decimal/fractional portion of the number.",
      type: "string",
      options: [
        "comma",
        "period",
      ],
    },
    toFormat: {
      label: "To Format",
      description: "The format the number will be converted to.",
      type: "string",
      options: [
        "Comma for grouping & period for decimal",
        "Period for grouping & comma for decimal",
        "Space for grouping & period for decimal",
        "Space for grouping & comma for decimal",
      ],
    },
  },
  async run({ $ }): Promise<string> {
    // const {
    //   input, currency, currencyFormat
    // } = this;

    const result = "";

    $.export("$summary", "Successfully formatted number");
    return result;
  },
});
