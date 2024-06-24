import { defineAction } from "@pipedream/types";
import { ConfigurationError } from "@pipedream/platform";
import { CURRENCY_OPTIONS } from "../../common/numbers/currencies";
import { CURRENCY_FORMAT_OPTIONS } from "../../common/numbers/currencyFormats";
import formatNumber from "../../common/numbers/formatNumber";
import app from "../../app/formatting.app";

export default defineAction({
  name: "[Numbers] Format Currency",
  description: "Format a number as a currency",
  key: "formatting-format-currency",
  version: "0.0.5",
  type: "action",
  props: {
    app,
    input: {
      label: "Input",
      description: "Number you would like to format as a currency.",
      type: "string",
    },
    currency: {
      label: "Currency",
      description: "Specify the currency to be used for formatting",
      type: "string",
      options: CURRENCY_OPTIONS,
    },
    currencyFormat: {
      label: "Currency Format",
      description:
        "Specify the format to be used for the currency formatting. Use the unicode currency symbol `¤` for special formatting options. [Formatting rules can be found here](http://www.unicode.org/reports/tr35/tr35-numbers.html#Number_Format_Patterns)",
      type: "string",
      options: CURRENCY_FORMAT_OPTIONS,
    },
  },
  async run({ $ }): Promise<string> {
    const {
      currency, currencyFormat,
    } = this;
    const input = this.input.toString();

    const [
      isoCode,
      currencySymbol,
      currencyName,
    ] = currency.split(" - ");

    let result = (currencyFormat.startsWith("¤") && currencySymbol) || "";

    const [
      integer,
      decimal,
    ] = input.split(input.includes(".")
      ? "."
      : ",");
    if (isNaN(Number(integer))) {
      throw new ConfigurationError("**Invalid number** - please check your input.");
    }

    const numberString = formatNumber(
      integer,
      (decimal?.length > 1
        ? decimal
        : (decimal ?? "0") + "0"),
      currencyFormat.includes(",")
        ? ","
        : "",
    );
    result += numberString;

    switch (currencyFormat.match(/¤+$/g)?.[0].length) {
    default:
      break;

      // ¤¤ - ISO currency symbol: USD, BRL, etc.
    case 2:
      result += ` ${isoCode}`;
      break;

      // ¤¤¤ - Currency display name: United States dollar, Brazilian real, etc.
    case 3:
      result += ` ${currencyName}`;
      break;
    }

    $.export("$summary", "Successfully formatted as currency");
    return result;
  },
});
