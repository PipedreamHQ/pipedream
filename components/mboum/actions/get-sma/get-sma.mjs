import mboum from "../../mboum.app.mjs";

export default {
  key: "mboum-get-sma",
  name: "Get Simple Moving Average (SMA)",
  description: "Calculate Simple Moving Average technical indicator for stocks and crypto. [See the documentation](https://docs.mboum.com/#stocks-options-small-stylecolor-f8f2f2background-fa256fpadding-1px-4pxborder-radius-3pxhotsmall-GETapi-v1-markets-indicators-sma)",
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
      propDefinition: [
        mboum,
        "interval",
      ],
    },
    seriesType: {
      propDefinition: [
        mboum,
        "seriesType",
      ],
    },
    timePeriod: {
      type: "integer",
      label: "Time Period",
      description: "Number of periods for SMA calculation",
      optional: true,
    },
    limit: {
      propDefinition: [
        mboum,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.mboum.getSMA({
      $,
      params: {
        ticker: this.ticker,
        interval: this.interval,
        series_type: this.seriesType,
        time_period: this.timePeriod,
        limit: this.limit,
      },
    });

    $.export("$summary", `Successfully calculated SMA(${this.timePeriod}) for ${this.ticker} on ${this.interval} intervals`);
    return response;
  },
};
