import app from "../../bitget.app.mjs";

export default {
  key: "bitget-spot-market-get-recent-trades",
  name: "Spot - Market - Get Recent Trades",
  description: "Retrieve recent trade fills for a specified symbol. [See the documentation](https://www.bitget.com/api-doc/spot/market/Get-Recent-Trades)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    symbol: {
      optional: false,
      propDefinition: [
        app,
        "symbol",
      ],
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Default: `100`, maximum: `500`",
      optional: true,
      min: 1,
      max: 500,
    },
  },
  async run({ $ }) {
    const {
      app,
      symbol,
      limit,
    } = this;

    const response = await app.getSpotMarketRecentTrades({
      $,
      params: {
        symbol,
        limit,
      },
    });

    $.export("$summary", `Successfully retrieved \`${response?.data?.length}\` recent trades for \`${symbol}\``);
    return response;
  },
};
