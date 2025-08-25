import mboum from "../../mboum.app.mjs";

export default {
  key: "mboum-get-rsi",
  name: "Get Relative Strength Index (RSI)",
  description: "Calculate Relative Strength Index technical indicator to measure momentum and identify overbought/oversold conditions. [See the documentation](https://docs.mboum.com/#stocks-options-small-stylecolor-f8f2f2background-fa256fpadding-1px-4pxborder-radius-3pxhotsmall-GETapi-v1-markets-indicators-rsi)",
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
      description: "Number of periods for RSI calculation",
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
    const response = await this.mboum.getRSI({
      $,
      params: {
        ticker: this.ticker,
        interval: this.interval,
        series_type: this.seriesType,
        time_period: this.timePeriod,
        limit: this.limit,
      },
    });

    $.export("$summary", `Successfully calculated RSI(${this.timePeriod}) for ${this.ticker} on ${this.interval} intervals`);
    return response;
  },
};
