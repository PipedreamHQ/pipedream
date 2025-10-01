import mboum from "../../mboum.app.mjs";

export default {
  key: "mboum-get-adx",
  name: "Get Average Directional Index (ADX)",
  description: "Calculate Average Directional Index technical indicator to measure trend strength and direction. [See the documentation](https://docs.mboum.com/#stocks-options-small-stylecolor-f8f2f2background-fa256fpadding-1px-4pxborder-radius-3pxhotsmall-GETapi-v1-markets-indicators-adx)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
      description: "Number of periods for ADX calculation",
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
    const response = await this.mboum.getADX({
      $,
      params: {
        ticker: this.ticker,
        interval: this.interval,
        series_type: this.seriesType,
        time_period: this.timePeriod,
        limit: this.limit,
      },
    });

    $.export("$summary", `Successfully calculated ADX(${this.timePeriod}) for ${this.ticker} on ${this.interval} intervals`);
    return response;
  },
};
