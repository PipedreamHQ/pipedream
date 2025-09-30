import app from "../../bitget.app.mjs";

export default {
  key: "bitget-future-market-get-contracts-oi",
  name: "Future - Market - Get Contracts OI",
  description: "Retrieve open interest for contracts. [See the documentation](https://www.bitget.com/api-doc/contract/market/Get-Contracts-Oi)",
  version: "0.0.3",
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

    const response = await app.getFutureMarketContractsOi({
      $,
      params: {
        symbol,
        productType,
      },
    });

    $.export("$summary", `Successfully retrieved contracts open interest for \`${symbol}\``);
    return response;
  },
};
