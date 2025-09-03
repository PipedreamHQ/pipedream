import mboum from "../../mboum.app.mjs";

export default {
  key: "mboum-get-macd",
  name: "Get MACD",
  description: "Calculate Moving Average Convergence Divergence (MACD) technical indicator to identify trend changes and momentum. [See the documentation](https://docs.mboum.com/#stocks-options-small-stylecolor-f8f2f2background-fa256fpadding-1px-4pxborder-radius-3pxhotsmall-GETapi-v1-markets-indicators-macd)",
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
    fastPeriod: {
      type: "integer",
      label: "Fast Period",
      description: "Fast period for MACD calculation",
      optional: true,
    },
    slowPeriod: {
      type: "integer",
      label: "Slow Period",
      description: "Slow period for MACD calculation",
      optional: true,
    },
    signalPeriod: {
      type: "integer",
      label: "Signal Period",
      description: "Signal line period for MACD calculation",
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
    const response = await this.mboum.getMACD({
      $,
      params: {
        ticker: this.ticker,
        interval: this.interval,
        series_type: this.seriesType,
        fast_period: this.fastPeriod,
        slow_period: this.slowPeriod,
        signal_period: this.signalPeriod,
        limit: this.limit,
      },
    });

    $.export("$summary", `Successfully calculated MACD(${this.fastPeriod},${this.slowPeriod},${this.signalPeriod}) for ${this.ticker} on ${this.interval} intervals`);
    return response;
  },
};
