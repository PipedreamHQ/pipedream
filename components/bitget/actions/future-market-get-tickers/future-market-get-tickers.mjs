import app from "../../bitget.app.mjs";

export default {
  key: "bitget-future-market-get-tickers",
  name: "Future - Market - Get Tickers",
  description: "Get all ticker data of the given product type. [See the documentation](https://www.bitget.com/api-doc/contract/market/Get-All-Symbol-Ticker)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    productType: {
      propDefinition: [
        app,
        "productType",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      productType,
    } = this;

    const response = await app.getFutureMarketTickers({
      $,
      params: {
        productType,
      },
    });

    $.export("$summary", `Successfully retrieved ticker information for all symbols of product type \`${productType}\``);
    return response;
  },
};
