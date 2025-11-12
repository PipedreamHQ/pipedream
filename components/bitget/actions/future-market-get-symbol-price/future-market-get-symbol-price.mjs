import app from "../../bitget.app.mjs";

export default {
  key: "bitget-future-market-get-symbol-price",
  name: "Future - Market - Get Symbol Price",
  description: "Retrieve current price for a contract symbol. [See the documentation](https://www.bitget.com/api-doc/contract/market/Get-Symbol-Price)",
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

    const response = await app.getFutureMarketSymbolPrice({
      $,
      params: {
        symbol,
        productType,
      },
    });

    $.export("$summary", `Successfully retrieved current price for \`${symbol}\``);
    return response;
  },
};
