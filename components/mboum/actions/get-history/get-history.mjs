import mboum from "../../mboum.app.mjs";

export default {
  key: "mboum-get-history",
  name: "Get Stock History",
  description: "Get historical stock data including OHLCV (Open, High, Low, Close, Volume) data. [See the documentation](https://docs.mboum.com/#stocks-options-small-stylecolor-f8f2f2background-fa256fpadding-1px-4pxborder-radius-3pxhotsmall-GETapi-v2-markets-stock-history)",
  version: "0.0.1",
  type: "action",
  props: {
    mboum,
    ticker: {
      propDefinition: [
        mboum,
        "ticker",
      ],
    },
    interval: {
      type: "string",
      label: "Interval",
      description: "Time interval between two consecutive data points in the time series",
      options: [
        {
          value: "1m",
          label: "1 min candles",
        },
        {
          value: "2m",
          label: "2 min candles",
        },
        {
          value: "3m",
          label: "3 min candles",
        },
        {
          value: "5m",
          label: "5 mins candles",
        },
        {
          value: "15m",
          label: "15 mins candles",
        },
        {
          value: "30m",
          label: "30 mins candles",
        },
        {
          value: "1wk",
          label: "weekly candles",
        },
        {
          value: "1mo",
          label: "monthly candles",
        },
        {
          value: "1qty",
          label: "quarterly candles",
        },
      ],
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of data points to return. (1-1000)",
      optional: true,
      min: 1,
      max: 1000,
    },
    dividend: {
      type: "boolean",
      label: "Dividend",
      description: "Include dividend in response",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.mboum.getHistory({
      $,
      params: {
        ticker: this.ticker,
        interval: this.interval,
        limit: this.limit,
        dividend: this.dividend,
      },
    });

    $.export("$summary", `Successfully retrieved ${this.interval} historical data for ${this.ticker}`);
    return response;
  },
};
