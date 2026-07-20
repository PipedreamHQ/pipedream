import adanos from "../../adanos.app.mjs";

export default {
  key: "adanos-get-stock-sentiment",
  name: "Get Stock Sentiment",
  description: "Get sentiment and attention metrics for one stock from Reddit, X / FinTwit, financial news, or Polymarket. [See the documentation](https://api.adanos.org/docs)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    adanos,
    ticker: {
      type: "string",
      label: "Stock Ticker",
      description: "A stock ticker such as `AAPL`, `TSLA`, or `BRK.A`.",
    },
    source: {
      propDefinition: [
        adanos,
        "source",
      ],
    },
    fromDate: {
      propDefinition: [
        adanos,
        "fromDate",
      ],
    },
    toDate: {
      propDefinition: [
        adanos,
        "toDate",
      ],
    },
  },
  async run({ $ }) {
    const ticker = String(this.ticker).trim()
      .replace(/^\$/, "")
      .toUpperCase();
    const response = await this.adanos.getStockSentiment({
      $,
      ticker: this.ticker,
      source: this.source,
      fromDate: this.fromDate,
      toDate: this.toDate,
    });
    $.export("$summary", `Retrieved ${this.source} sentiment for ${ticker}.`);
    return response;
  },
};
