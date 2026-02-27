import app from "../../coingecko.app.mjs";

export default {
  key: "coingecko-get-exchange-rates",
  name: "Get Exchange Rates",
  description: "Get BTC-to-currency exchange rates for currencies recognized by CoinGecko. [See the documentation](https://docs.coingecko.com/v3.0.1/reference/exchange-rates)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
  },
  async run({ $ }) {
    const response = await this.app.getExchangeRates({
      $,
    });
    $.export("$summary", `Successfully retrieved ${Object.keys(response.rates).length} exchange rates`);
    return response;
  },
};
