import { defineAction } from "@pipedream/types";
import app from "../../app/currencyscoop.app";

export default defineAction({
  name: "Get Latest Exchanges Rates",
  description: "Get the latest exchange rates for a currency [See the documentation](https://currencybeacon.com/api-documentation)",
  key: "currencyscoop-get-latest-exchange-rates",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
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
        "targetCurrencies",
      ],
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
        symbols: symbols.join(),
      },
    };

    const response = await this.app.getLatestRates(params);

    $.export("$summary", `Obtained latest rates for ${base}`);

    return response;
  },
});
