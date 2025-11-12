import app from "../../bitget.app.mjs";

export default {
  key: "bitget-future-market-get-recent-fills",
  name: "Future - Market - Get Recent Fills",
  description: "Retrieve recent fill data for a contract symbol. [See the documentation](https://www.bitget.com/api-doc/contract/market/Get-Recent-Fills)",
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
    limit: {
      type: "integer",
      label: "Limit",
      description: "Default: `100`, maximum: `100`",
      optional: true,
      min: 1,
      max: 100,
    },
  },
  async run({ $ }) {
    const {
      app,
      symbol,
      productType,
      limit,
    } = this;

    const response = await app.getFutureMarketRecentFills({
      $,
      params: {
        symbol,
        productType,
        limit,
      },
    });

    $.export("$summary", `Successfully retrieved recent fills for \`${symbol}\``);
    return response;
  },
};
