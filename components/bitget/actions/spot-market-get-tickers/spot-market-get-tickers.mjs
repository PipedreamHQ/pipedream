import app from "../../bitget.app.mjs";

export default {
  key: "bitget-spot-market-get-tickers",
  name: "Spot - Market - Get Tickers",
  description: "Obtain ticker information for all trading pairs or specific ones. [See the documentation](https://www.bitget.com/api-doc/spot/market/Get-Tickers)",
  version: "0.0.2",
  type: "action",
  props: {
    app,
    symbol: {
      propDefinition: [
        app,
        "symbol",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      symbol,
    } = this;

    const response = await app.getSpotMarketTickers({
      $,
      params: {
        symbol,
      },
    });

    $.export("$summary", `Successfully retrieved \`${response.data?.length}\` ticker(s).`);

    return response.data;
  },
};
