import app from "../../bitget.app.mjs";

export default {
  key: "bitget-future-market-get-history-mark-candle-data",
  name: "Future - Market - Get History Mark Candle Data",
  description: "Retrieve historical mark price candlestick data for a contract symbol. [See the documentation](https://www.bitget.com/api-doc/contract/market/Get-History-Mark-Candle-Data)",
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
      optional: false,
      propDefinition: [
        app,
        "ticker",
        ({ productType }) => ({
          productType,
        }),
      ],
    },
    granularity: {
      propDefinition: [
        app,
        "kLineParticleSize",
      ],
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
    limit: {
      type: "integer",
      label: "Limit",
      description: "Default: `100`, maximum: `200`",
      optional: true,
      min: 1,
      max: 200,
    },
  },
  async run({ $ }) {
    const {
      app,
      symbol,
      productType,
      granularity,
      startTime,
      endTime,
      limit,
    } = this;

    const response = await app.getFutureMarketHistoryMarkCandleData({
      $,
      params: {
        symbol,
        productType,
        granularity,
        startTime,
        endTime,
        limit,
      },
    });

    $.export("$summary", `Successfully retrieved historical mark price candle data points for \`${symbol}\``);
    return response;
  },
};
