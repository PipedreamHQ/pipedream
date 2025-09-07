import app from "../../bitget.app.mjs";

export default {
  key: "bitget-future-market-get-fills-history",
  name: "Future - Market - Get Fills History",
  description: "Retrieve historical fill data for a contract symbol. [See the documentation](https://www.bitget.com/api-doc/contract/market/Get-Fills-History)",
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
    limit: {
      type: "integer",
      label: "Limit",
      description: "Default: `500`, maximum: `1000`",
      optional: true,
      min: 1,
      max: 1000,
    },
    startTime: {
      propDefinition: [
        app,
        "startTime",
      ],
    },
    endTime: {
      propDefinition: [
        app,
        "endTime",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      symbol,
      productType,
      limit,
      startTime,
      endTime,
    } = this;

    const response = await app.getFutureMarketFillsHistory({
      $,
      params: {
        symbol,
        productType,
        limit,
        startTime,
        endTime,
      },
    });

    $.export("$summary", `Successfully retrieved ${response?.data?.length || 0} historical fills for ${symbol}`);
    return response;
  },
};
