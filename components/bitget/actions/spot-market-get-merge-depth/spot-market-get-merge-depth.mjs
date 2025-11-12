import app from "../../bitget.app.mjs";

export default {
  key: "bitget-spot-market-get-merge-depth",
  name: "Spot - Market - Get Merge Depth",
  description: "Retrieve merge depth for a specified symbol. [See the documentation](https://www.bitget.com/api-doc/spot/market/Merge-Orderbook)",
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
    precision: {
      propDefinition: [
        app,
        "precision",
      ],
    },
    limit: {
      propDefinition: [
        app,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      symbol,
      precision,
      limit,
    } = this;

    const response = await app.getSpotMarketMergedOrderbook({
      $,
      params: {
        symbol,
        precision,
        limit,
      },
    });

    $.export("$summary", `Successfully retrieved merged order book for symbol \`${symbol}\``);
    return response;
  },
};
