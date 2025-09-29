import mboum from "../../mboum.app.mjs";

export default {
  key: "mboum-get-insider-trading",
  name: "Get Insider Trading Data",
  description: "Get insider trading activities including buys, sells, and other transactions by company insiders. [See the documentation](https://docs.mboum.com/#stocks-options-small-stylecolor-f8f2f2background-fa256fpadding-1px-4pxborder-radius-3pxhotsmall-GETapi-v1-markets-insider-trades)",
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
      label: "Transaction Type",
      description: "Type of insider transaction",
      options: [
        "Buy",
        "Sell",
        "Transfer",
      ],
      optional: true,
    },
    minValue: {
      type: "string",
      label: "Minimum Value",
      description: "Filter results by min transaction value",
      optional: true,
    },
    politiciansOnly: {
      type: "boolean",
      label: "Politicians Only",
      description: "Return insider trades from U.S Congressmen and Senators only",
      optional: true,
    },
    page: {
      propDefinition: [
        mboum,
        "page",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.mboum.getInsiderTrading({
      $,
      params: {
        ticker: this.ticker,
        type: this.type,
        minValue: this.minValue,
        politiciansOnly: this.politiciansOnly,
        page: this.page,
      },
    });

    const tickerText = this.ticker
      ? ` for ${this.ticker}`
      : "";
    $.export("$summary", `Successfully retrieved insider trading data${tickerText}`);
    return response;
  },
};
