import mboum from "../../mboum.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "mboum-get-stoch",
  name: "Get Stochastic Oscillator (STOCH)",
  description: "Calculate Stochastic Oscillator technical indicator to identify momentum and potential reversal points. [See the documentation](https://docs.mboum.com/#stocks-options-small-stylecolor-f8f2f2background-fa256fpadding-1px-4pxborder-radius-3pxhotsmall-GETapi-v1-markets-indicators-stochh)",
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
    fastKPeriod: {
      type: "integer",
      label: "Fast K Period",
      description: "Number of periods for %K calculation",
      optional: true,
    },
    slowKPeriod: {
      type: "integer",
      label: "Slow K Period",
      description: "Smoothing period for %K",
      optional: true,
    },
    slowDPeriod: {
      type: "integer",
      label: "Slow D Period",
      description: "Smoothing period for %D",
      optional: true,
    },
    slowKMaType: {
      type: "string",
      label: "Slow K MA Type",
      description: "Moving average type for %K smoothing",
      options: constants.MA_TYPES,
      optional: true,
    },
    slowDMaType: {
      type: "string",
      label: "Slow D MA Type",
      description: "Moving average type for %D smoothing",
      options: constants.MA_TYPES,
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
    const response = await this.mboum.getSTOCH({
      $,
      params: {
        ticker: this.ticker,
        interval: this.interval,
        fastK_period: this.fastKPeriod,
        slowK_period: this.slowKPeriod,
        slowD_period: this.slowDPeriod,
        slowK_ma_type: this.slowKMaType,
        slowD_ma_type: this.slowDMaType,
        limit: this.limit,
      },
    });

    $.export("$summary", `Successfully calculated STOCH(${this.fastKPeriod},${this.slowKPeriod},${this.slowDPeriod}) for ${this.ticker} on ${this.interval} intervals`);
    return response;
  },
};
