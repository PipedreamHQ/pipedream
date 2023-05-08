import { defineAction } from "@pipedream/types";
import app from "../../app/currencyscoop.app";

export default defineAction({
  name: "Convert Currency",
  description: `Convert a specified amount from one currency to another [See the documentation](https://currencybeacon.com/api-documentation)`,
  key: "currencyscoop-convert-currency",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    amount: {
      type: "integer",
      label: "Amount",
      description:
        'The amount to convert',
    },
    from: {
      propDefinition: [
        app,
        "currency"
      ],
    },
    to: {
      propDefinition: [
        app,
        "currency"
      ],
      label: "Target Currency",
      description: "The currency you would like to convert to"
    }
  },
  async run({ $ }) {
    const { amount, from, to } = this;
    const params = {
      $,
      params: {
        amount,
        from,
        to,
      },
    };

    const response = await this.app.convertCurrency(params);

    $.export("$summary", `Converted currency`);

    return response;
  },
});
