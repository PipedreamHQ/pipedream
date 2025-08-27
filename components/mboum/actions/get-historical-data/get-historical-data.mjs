import mboum from "../../mboum.app.mjs";

export default {
  key: "mboum-get-historical-data",
  name: "Get Historical Data",
  description: "Get comprehensive historical stock data with advanced filtering and date range options. [See the documentation](https://docs.mboum.com/#stocks-options-small-stylecolor-f8f2f2background-fa256fpadding-1px-4pxborder-radius-3pxhotsmall-GETapi-v2-markets-stock-historical)",
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
      description: "Type of historical data to retrieve",
      options: [
        "STOCKS",
        "ETF",
        "MUTUALFUNDS",
        "FUTURES",
      ],
    },
    fromDate: {
      type: "string",
      label: "From Date",
      description: "Enter a from date, format: YYYY-MM-DD",
    },
    toDate: {
      type: "string",
      label: "To Date",
      description: "Enter a to date, format: YYYY-MM-DD",
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of data points to return",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.mboum.getHistoricalData({
      $,
      params: {
        ticker: this.ticker,
        type: this.type,
        from_date: this.fromDate,
        to_date: this.toDate,
        limit: this.limit,
      },
    });

    $.export("$summary", `Successfully retrieved historical data for ${this.ticker}`);
    return response;
  },
};
