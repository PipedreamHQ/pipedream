import mboum from "../../mboum.app.mjs";

export default {
  key: "mboum-get-adosc",
  name: "Get Accumulation/Distribution Oscillator (ADOSC)",
  description: "Calculate Accumulation/Distribution Oscillator technical indicator to measure the momentum of volume flow. [See the documentation](https://docs.mboum.com/#stocks-options-small-stylecolor-f8f2f2background-fa256fpadding-1px-4pxborder-radius-3pxhotsmall-GETapi-v1-markets-indicators-adosc)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
    fastPeriod: {
      type: "integer",
      label: "Fast Period",
      description: "Fast period for ADOSC calculation",
      optional: true,
    },
    slowPeriod: {
      type: "integer",
      label: "Slow Period",
      description: "Slow period for ADOSC calculation",
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
    const response = await this.mboum.getADOSC({
      $,
      params: {
        ticker: this.ticker,
        interval: this.interval,
        series_type: this.seriesType,
        fast_period: this.fastPeriod,
        slow_period: this.slowPeriod,
        limit: this.limit,
      },
    });

    $.export("$summary", `Successfully calculated ADOSC(${this.fastPeriod},${this.slowPeriod}) for ${this.ticker} on ${this.interval} intervals`);
    return response;
  },
};
