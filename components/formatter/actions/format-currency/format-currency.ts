import { defineAction } from "@pipedream/types";
import currencies from "../../common/numbers/currencies";
import { CURRENCY_OPTIONS } from "../../common/numbers/currencyFormats";
import formatNumber from "../../common/numbers/formatNumber";

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
      type: "integer",
    },
    currency: {
      label: "Currency Symbol",
      description: "Specify the currency to be used for formatting",
      type: "string",
      options: currencies,
    },
    currencyFormat: {
      label: "Currency Format",
      description:
        "Specify the format to be used for the currency formatting. Use the unicode currency symbol `¤` for special formatting options. [Formatting rules can be found here](http://www.unicode.org/reports/tr35/tr35-numbers.html#Number_Format_Patterns)",
      type: "string",
      options: CURRENCY_OPTIONS,
    },
  },
  async run({ $ }): Promise<string> {
    const { input, currency, currencyFormat } = this;

    let result = "";

    const currencySymbol = "$";

    if (currencyFormat.startsWith("¤")) {
      result += currencySymbol;
    }

    const [integer, decimal] = input.toString().split(".");
    const numberString = formatNumber(
      integer,
      decimal ?? "00",
      currencyFormat.includes(",") ? "," : ""
    );
    result += numberString;

    switch (currencyFormat.match(/¤+$/g)?.[0].length) {
      default:
        break;

      // ¤¤ - ISO currency symbol
      case 2:
        break;

      // ¤¤¤ - Currency display name
      case 3:
        break;
    }

    $.export("$summary", "Successfully formatted as currency");
    return result;
  },
});
