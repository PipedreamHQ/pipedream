import fixerIo from "../../fixer_io.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "fixer_io-convert-currency",
  name: "Convert Currency",
  description: "Convert amount from one currency to another using real-time exchange rates. [See the documentation](https://fixer.io/documentation)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    fixerIo,
    from: {
      type: "string",
      label: "From Currency",
      description: "The three-letter currency code of the currency you would like to convert from",
    },
    to: {
      type: "string",
      label: "To Currency",
      description: "The three-letter currency code of the currency you would like to convert to",
    },
    amount: {
      type: "string",
      label: "Amount",
      description: "The amount to be converted",
    },
    date: {
      type: "string",
      label: "Date",
      description: "Specify a date (format YYYY-MM-DD) to use historical rates for this conversion",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.fixerIo.convertCurrency({
      $,
      params: {
        from: this.from,
        to: this.to,
        amount: this.amount,
        date: this.date,
      },
    });
    if (response.error) {
      throw new ConfigurationError(response.error.info);
    }
    $.export("$summary", `Successfully converted ${this.amount} ${this.from} to ${this.to}`);
    return response;
  },
};
