import app from "../../bitget.app.mjs";

export default {
  key: "bitget-future-market-get-current-funding-rate",
  name: "Future - Market - Get Current Funding Rate",
  description: "Retrieve current funding rate for a contract symbol. [See the documentation](https://www.bitget.com/api-doc/contract/market/Get-Current-Funding-Rate)",
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

    const response = await app.getFutureMarketCurrentFundingRate({
      $,
      params: {
        symbol,
        productType,
      },
    });

    $.export("$summary", `Successfully retrieved current funding rate for \`${symbol}\``);
    return response;
  },
};
