import mboum from "../../mboum.app.mjs";

export default {
  key: "mboum-get-ticker-summary",
  name: "Get Ticker Summary",
  description: "Get comprehensive ticker summary including key statistics, financial metrics, and company overview. [See the documentation](https://docs.mboum.com/#stocks-options-small-stylecolor-f8f2f2background-fa256fpadding-1px-4pxborder-radius-3pxhotsmall-GETapi-v2-markets-stock-ticker-summary)",
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
    type: {
      type: "string",
      label: "Type",
      description: "Type of ticker summary to retrieve",
      options: [
        "STOCKS",
        "ETF",
        "MUTUALFUNDS",
        "FUTURES",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.mboum.getTickerSummary({
      $,
      params: {
        ticker: this.ticker,
        type: this.type,
      },
    });

    $.export("$summary", `Successfully retrieved ticker summary for ${this.ticker}`);
    return response;
  },
};
