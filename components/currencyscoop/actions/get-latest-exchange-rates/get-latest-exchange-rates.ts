import { defineAction } from "@pipedream/types";
import app from "../../app/currencyscoop.app";

export default defineAction({
  name: "Get Latest Exchanges Rates",
  description: "Get the latest exchange rates for a currency [See the documentation](https://currencybeacon.com/api-documentation)",
  key: "currencyscoop-get-latest-exchange-rates",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    base: {
      propDefinition: [
        app,
        "currency",
      ],
    },
    symbols: {
      propDefinition: [
        app,
        "currency",
      ],
      type: "string[]",
      label: "Target Currencies",
      description: "A list of currencies you will like to see the rates for. [See all supported currencies here.](https://currencybeacon.com/supported-currencies)",
    },
  },
  async run({ $ }) {
    const {
      base, symbols,
    } = this;

    const params = {
      $,
      params: {
        base,
        symbols,
      },
    };

    const response = await this.app.getLatestRates(params);

    $.export("$summary", "Obtained latest rates");

    return response;
  },
});
