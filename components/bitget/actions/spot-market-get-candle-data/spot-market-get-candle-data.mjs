import app from "../../bitget.app.mjs";

export default {
  key: "bitget-spot-market-get-candle-data",
  name: "Spot - Market - Get Candle Data",
  description: "Retrieve candlestick data for a specified symbol and time period. [See the documentation](https://www.bitget.com/api-doc/spot/market/Get-Candle-Data)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    symbol: {
      optional: false,
      propDefinition: [
        app,
        "symbol",
      ],
    },
    granularity: {
      propDefinition: [
        app,
        "granularity",
      ],
    },
    startTime: {
      type: "string",
      label: "Start Time",
      description: "The time start point of the chart data, i.e., to get the chart data after this timestamp Unix millisecond timestamp, e.g. `1690196141868`",
      optional: true,
    },
    endTime: {
      type: "string",
      label: "End Time",
      description: "The time end point of the chart data, i.e., get the chart data before this timestamp Unix millisecond timestamp, e.g. `1690196141868`",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Default: `100`, maximum: `1000`.",
      optional: true,
      min: 1,
      max: 1000,
    },
  },
  async run({ $ }) {
    const {
      app,
      symbol,
      granularity,
      startTime,
      endTime,
      limit,
    } = this;

    const response = await app.getSpotMarketCandleData({
      $,
      params: {
        symbol,
        granularity,
        startTime,
        endTime,
        limit,
      },
    });

    $.export("$summary", `Successfully retrieved \`${response?.data?.length}\` candle data points for \`${symbol}\``);
    return response;
  },
};
