import mboum from "../../mboum.app.mjs";

export default {
  key: "mboum-get-short-interest",
  name: "Get Short Interest",
  description: "Get short interest data including short ratio, short percentage of float, and short interest trends. [See the documentation](https://docs.mboum.com/#stocks-options-small-stylecolor-f8f2f2background-fa256fpadding-1px-4pxborder-radius-3pxhotsmall-GETapi-v2-markets-stock-short-interest)",
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
    type: {
      type: "string",
      label: "Type",
      description: "Type of short interest to retrieve",
      options: [
        "STOCKS",
        "ETF",
        "MUTUALFUNDS",
        "FUTURES",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.mboum.getShortInterest({
      $,
      params: {
        ticker: this.ticker,
        type: this.type,
      },
    });

    $.export("$summary", `Successfully retrieved short interest data for ${this.ticker}`);
    return response;
  },
};
