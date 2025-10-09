import { defineAction } from "@pipedream/types";
import app from "../../app/currencyscoop.app";

export default defineAction({
  name: "Get Historical Rates",
  description: "Get historical rates for a currency [See the documentation](https://currencybeacon.com/api-documentation)",
  key: "currencyscoop-get-historical-rates",
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
    date: {
      propDefinition: [
        app,
        "date",
      ],
    },
  },
  async run({ $ }) {
    const {
      base, date, symbols,
    } = this;

    const params = {
      $,
      params: {
        base,
        date,
        symbols: symbols.join(),
      },
    };

    const response = await this.app.getHistoricalRates(params);

    $.export("$summary", `Obtained historical rates for ${base}`);

    return response;
  },
});
