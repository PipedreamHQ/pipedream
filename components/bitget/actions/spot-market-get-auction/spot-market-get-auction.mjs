import app from "../../bitget.app.mjs";

export default {
  key: "bitget-spot-market-get-auction",
  name: "Spot - Market - Get Auction",
  description: "Retrieve auction data for a specified symbol. [See the documentation](https://www.bitget.com/api-doc/spot/market/Get-Auction)",
  version: "0.0.2",
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
  },
  async run({ $ }) {
    const {
      app,
      symbol,
    } = this;

    const response = await app.getSpotMarketAuction({
      $,
      params: {
        symbol,
      },
    });

    $.export("$summary", `Successfully retrieved auction data for \`${symbol}\``);

    return response;
  },
};
