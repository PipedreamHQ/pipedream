import mboum from "../../mboum.app.mjs";

export default {
  key: "mboum-get-ad",
  name: "Get Accumulation/Distribution Line (AD)",
  description: "Calculate Accumulation/Distribution Line technical indicator to measure volume flow and confirm price trends. [See the documentation](https://docs.mboum.com/#stocks-options-small-stylecolor-f8f2f2background-fa256fpadding-1px-4pxborder-radius-3pxhotsmall-GETapi-v1-markets-indicators-ad)",
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
    limit: {
      propDefinition: [
        mboum,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.mboum.getAD({
      $,
      params: {
        ticker: this.ticker,
        interval: this.interval,
        limit: this.limit,
      },
    });

    $.export("$summary", `Successfully calculated A/D Line for ${this.ticker} on ${this.interval} intervals`);
    return response;
  },
};
