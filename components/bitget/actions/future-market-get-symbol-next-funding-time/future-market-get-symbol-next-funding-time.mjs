import app from "../../bitget.app.mjs";

export default {
  key: "bitget-future-market-get-symbol-next-funding-time",
  name: "Future - Market - Get Symbol Next Funding Time",
  description: "Retrieve next funding time for a contract symbol. [See the documentation](https://www.bitget.com/api-doc/contract/market/Get-Symbol-Next-Funding-Time)",
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

    const response = await app.getFutureMarketSymbolNextFundingTime({
      $,
      params: {
        symbol,
        productType,
      },
    });

    $.export("$summary", `Successfully retrieved next funding time for \`${symbol}\``);
    return response;
  },
};
