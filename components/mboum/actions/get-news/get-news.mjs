import mboum from "../../mboum.app.mjs";

export default {
  key: "mboum-get-news",
  name: "Get Financial News",
  description: "Get latest financial news and market updates, with optional filtering by ticker or category. [See the documentation](https://docs.mboum.com/#stocks-options-small-stylecolor-f8f2f2background-fa256fpadding-1px-4pxborder-radius-3pxhotsmall-GETapi-v2-markets-news)",
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
      description: "Type of news to retrieve",
      options: [
        "ALL",
        "MARKET",
        "VIDEO",
        "PRESS-RELEASE",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.mboum.getNews({
      $,
      params: {
        ticker: this.ticker,
        type: this.type,
      },
    });

    const tickerText = this.ticker
      ? ` for ${this.ticker}`
      : "";
    $.export("$summary", `Successfully retrieved financial news${tickerText}`);
    return response;
  },
};
