import { defineAction } from "@pipedream/types";
import { ConfigurationError } from "@pipedream/platform";
import formatNumber from "../../common/numbers/formatNumber";

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
        "The character the input uses to denote the decimal/fractional portion of the number. Defaults to period `.`",
      type: "string",
      options: [
        {
          label: "comma",
          value: ",",
        },
        {
          label: "period",
          value: ".",
        },
      ],
      optional: true,
    },
    toFormat: {
      label: "To Format",
      description: "The format the number will be converted to.",
      type: "string",
      options: [
        {
          label: "Comma for grouping & period for decimal",
          value: ",.",
        },
        {
          label: "Period for grouping & comma for decimal",
          value: ".,",
        },
        {
          label: "Space for grouping & period for decimal",
          value: " .",
        },
        {
          label: "Space for grouping & comma for decimal",
          value: " ,",
        },
      ],
    },
  },
  async run({ $ }): Promise<string> {
    const {
      input, inputDecimalMark, toFormat,
    }: Record<string, string> = this;

    const decimalMark = inputDecimalMark ?? ".";
    const splitInput = input.split(decimalMark);
    if (splitInput.length > 2) {
      throw new ConfigurationError(
        `Input has more than one decimal mark (\`${decimalMark}\`). Check if the \`Input Decimal Mark\` prop is set correctly.`,
      );
    }

    const [
      integer,
      decimal,
    ] = splitInput;
    const [
      groupChar,
      decimalChar,
    ] = toFormat.split("");

    const result = formatNumber(integer, decimal, groupChar, decimalChar);

    $.export("$summary", "Successfully formatted number");
    return result;
  },
});
