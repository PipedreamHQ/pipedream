import mboum from "../../mboum.app.mjs";

export default {
  key: "mboum-get-cci",
  name: "Get Commodity Channel Index (CCI)",
  description: "Calculate Commodity Channel Index technical indicator to identify cyclical trends and overbought/oversold conditions. [See the documentation](https://docs.mboum.com/#stocks-options-small-stylecolor-f8f2f2background-fa256fpadding-1px-4pxborder-radius-3pxhotsmall-GETapi-v1-markets-indicators-cci)",
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
      description: "Number of periods for CCI calculation",
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
    const response = await this.mboum.getCCI({
      $,
      params: {
        ticker: this.ticker,
        interval: this.interval,
        series_type: this.seriesType,
        time_period: this.timePeriod,
        limit: this.limit,
      },
    });

    $.export("$summary", `Successfully calculated CCI(${this.timePeriod}) for ${this.ticker} on ${this.interval} intervals`);
    return response;
  },
};
