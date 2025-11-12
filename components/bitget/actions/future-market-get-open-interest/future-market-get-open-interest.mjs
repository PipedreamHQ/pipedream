import app from "../../bitget.app.mjs";

export default {
  key: "bitget-future-market-get-open-interest",
  name: "Future - Market - Get Open Interest",
  description: "Retrieve open interest data for a contract symbol. [See the documentation](https://www.bitget.com/api-doc/contract/market/Get-Open-Interest)",
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

    const response = await app.getFutureMarketOpenInterest({
      $,
      params: {
        symbol,
        productType,
      },
    });

    $.export("$summary", `Successfully retrieved open interest data for \`${symbol}\``);
    return response;
  },
};
