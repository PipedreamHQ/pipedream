import { defineAction } from "@pipedream/types";
import { ConfigurationError } from "@pipedream/platform";
import app from "../../app/currencyscoop.app";

export default defineAction({
  name: "Convert Currency",
  description: "Convert a specified amount from one currency to another [See the documentation](https://currencybeacon.com/api-documentation)",
  key: "currencyscoop-convert-currency",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    amount: {
      type: "string",
      label: "Amount",
      description:
        "The amount to convert",
    },
    from: {
      propDefinition: [
        app,
        "currency",
      ],
    },
    to: {
      propDefinition: [
        app,
        "currency",
      ],
      label: "Target Currency",
      description: "The currency you would like to convert to",
    },
  },
  async run({ $ }) {
    const {
      amount, from, to,
    } = this;

    if (isNaN(Number(amount))) {
      throw new ConfigurationError("`amount` must be a valid number!");
    }

    const params = {
      $,
      params: {
        amount,
        from,
        to,
      },
    };

    const response = await this.app.convertCurrency(params);

    const { response: { value } } = response;
    $.export("$summary", `Converted ${amount} ${from} to ${value} ${to}`);

    return response;
  },
});
