import { ConfigurationError } from "@pipedream/platform";
import formatNumber from "../../common/numbers/formatNumber.mjs";
import {
  DECIMAL_MARK_OPTIONS, FINAL_FORMAT_OPTIONS,
} from "../../common/numbers/numberFormattingOptions.mjs";
import pipedream_utils from "../../pipedream_utils.app.mjs";
export default {
  name: "Formatting - [Numbers] Format Number",
  description: "Format a number to a new style. Does not perform any rounding or padding of the number.",
  key: "pipedream_utils-format-number",
  version: "0.0.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: false,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    pipedream_utils,
    input: {
      label: "Input",
      description: "Number string you would like to format.",
      type: "string",
    },
    inputDecimalMark: {
      label: "Input Decimal Mark",
      description: "The character the input uses to denote the decimal/fractional portion of the number. Defaults to period `.`",
      type: "string",
      options: DECIMAL_MARK_OPTIONS,
      optional: true,
    },
    toFormat: {
      label: "Output Format",
      description: "The format the number will be converted to.",
      type: "string",
      options: FINAL_FORMAT_OPTIONS,
    },
  },
  async run({ $ }) {
    const {
      inputDecimalMark, toFormat,
    } = this;
    const input = this.input.toString();
    const decimalMark = inputDecimalMark ?? ".";
    const splitInput = input.split(decimalMark);
    if (splitInput.length > 2) {
      throw new ConfigurationError(`Input has more than one decimal mark (\`${decimalMark}\`). Check if the \`Input Decimal Mark\` prop is set correctly.`);
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
};
