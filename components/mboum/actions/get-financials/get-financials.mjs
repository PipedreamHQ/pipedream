import mboum from "../../mboum.app.mjs";

export default {
  key: "mboum-get-financials",
  name: "Get Financial Statements",
  description: "Get comprehensive financial statements including income statement, balance sheet, and cash flow data. [See the documentation](https://docs.mboum.com/#stocks-options-small-stylecolor-f8f2f2background-fa256fpadding-1px-4pxborder-radius-3pxhotsmall-GETapi-v2-markets-stock-financials)",
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
  },
  async run({ $ }) {
    const response = await this.mboum.getFinancials({
      $,
      params: {
        ticker: this.ticker,
      },
    });

    $.export("$summary", `Successfully retrieved financials for ${this.ticker}`);
    return response;
  },
};
