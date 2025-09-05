import mboum from "../../mboum.app.mjs";

export default {
  key: "mboum-get-revenue",
  name: "Get Revenue Data",
  description: "Get detailed revenue breakdown and analysis for a company including revenue trends and segments. [See the documentation](https://docs.mboum.com/#stocks-options-small-stylecolor-f8f2f2background-fa256fpadding-1px-4pxborder-radius-3pxhotsmall-GETapi-v2-markets-stock-revenue)",
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
    page: {
      propDefinition: [
        mboum,
        "page",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.mboum.getRevenue({
      $,
      params: {
        ticker: this.ticker,
        page: this.page,
      },
    });

    $.export("$summary", `Successfully retrieved revenue data for ${this.ticker}`);
    return response;
  },
};
