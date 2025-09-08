import app from "../../bitget.app.mjs";

export default {
  key: "bitget-future-market-get-ticker",
  name: "Future - Market - Get Ticker",
  description: "Retrieve ticker information for a specific contract symbol. [See the documentation](https://www.bitget.com/api-doc/contract/market/Get-Ticker)",
  version: "0.0.2",
  type: "action",
  props: {
    app,
    productType: {
      propDefinition: [
        app,
        "productType",
      ],
    },
    symbol: {
      optional: false,
      propDefinition: [
        app,
        "ticker",
        ({ productType }) => ({
          productType,
        }),
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      symbol,
      productType,
    } = this;

    const response = await app.getFutureMarketTicker({
      $,
      params: {
        symbol,
        productType,
      },
    });

    $.export("$summary", `Successfully retrieved ticker information for \`${symbol}\``);
    return response;
  },
};
