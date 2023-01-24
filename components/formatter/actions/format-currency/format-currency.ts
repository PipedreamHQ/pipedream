import { defineAction } from "@pipedream/types";

export default defineAction({
  name: "[Numbers] Format Currency",
  description: "Format a number as a currency",
  key: "expofp-format-currency",
  version: "0.0.1",
  type: "action",
  props: {
    input: {
      label: "Input",
      description: "Number you would like to format as a currency.",
      type: "number",
    },
    currency: {
      label: "Currency",
      description:
        "Specify the currency to be used for formatting",
      type: "string",
    },
    currencyFormat: {
      label: "Currency Format",
      description: "Specify the format to be used for the currency formatting.",
      type: "string",
      options: []
    }
  },
  async run({ $ }): Promise<string> {
    // const {
    //   input, currency, currencyFormat
    // } = this;

    const result = '';

    $.export(
      "$summary",
      'Successfully formatted as currency',
    );
    return result;
  },
});
