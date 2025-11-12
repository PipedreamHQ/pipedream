import app from "../../bitget.app.mjs";

export default {
  key: "bitget-spot-market-get-history-candle-data",
  name: "Spot - Market - Get History Candle Data",
  description: "Retrieve history candlestick data for a specified symbol and time period. [See the documentation](https://www.bitget.com/api-doc/spot/market/Get-History-Candle-Data)",
  version: "0.0.4",
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
      description: "Time interval of charts. For the corresponding relationship between granularity and value, refer to the list below.\n- minute: `1min`, `3min`, `5min`, `15min`, `30min`\n- hour: `1h`, `4h`, `6h`, `12h`\n- day: `1day`, `3day`\n- week: `1week`\n- month: `1M`\n- hour in UTC: `6Hutc`, `12Hutc`\n- day in UTC: `1Dutc`, `3Dutc`\n- week in UTC: `1Wutc`\n- month in UTC: `1Mutc",
      options: [
        "1min",
        "3min",
        "5min",
        "15min",
        "30min",
        "1h",
        "4h",
        "6h",
        "12h",
        "1day",
        "3day",
        "1week",
        "1M",
        "6Hutc",
        "12Hutc",
        "1Dutc",
        "3Dutc",
        "1Wutc",
        "1Mutc",
      ],
    },
    endTime: {
      type: "string",
      label: "End Time",
      description: "The time end point of the chart data, i.e., get the chart data before this timestamp Unix millisecond timestamp, e.g. `1690196141868`",
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
      endTime,
      limit,
    } = this;

    const response = await app.getSpotMarketHistoryCandleData({
      $,
      params: {
        symbol,
        granularity,
        endTime,
        limit,
      },
    });

    $.export("$summary", `Successfully retrieved \`${response?.data?.length}\` history candle data points for \`${symbol}\``);
    return response;
  },
};
