import mboum from "../../mboum.app.mjs";

export default {
  key: "mboum-get-tickers",
  name: "Get Market Tickers",
  description: "Get a comprehensive list of stock tickers and symbols with detailed information. [See the documentation](https://docs.mboum.com/#stocks-options-small-stylecolor-f8f2f2background-fa256fpadding-1px-4pxborder-radius-3pxhotsmall-GETapi-v2-markets-tickers)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    mboum,
    type: {
      type: "string",
      label: "Type",
      description: "Type of tickers to retrieve",
      options: [
        "STOCKS",
        "ETF",
        "MUTUALFUNDS",
        "FUTURES",
        "INDEX",
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
    const response = await this.mboum.getTickers({
      $,
      params: {
        type: this.type,
        page: this.page,
      },
    });

    $.export("$summary", "Successfully retrieved market tickers");
    return response;
  },
};
