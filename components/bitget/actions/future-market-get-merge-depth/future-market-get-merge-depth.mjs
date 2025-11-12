import app from "../../bitget.app.mjs";

export default {
  key: "bitget-future-market-get-merge-depth",
  name: "Future - Market - Get Merge Depth",
  description: "Retrieve order book merge depth for a contract symbol. [See the documentation](https://www.bitget.com/api-doc/contract/market/Get-Merge-Depth)",
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
      productType,
      precision,
      limit,
    } = this;

    const response = await app.getFutureMarketContractMergeDepth({
      $,
      params: {
        symbol,
        productType,
        precision,
        limit,
      },
    });

    $.export("$summary", `Successfully retrieved merge depth for \`${symbol}\``);
    return response;
  },
};
