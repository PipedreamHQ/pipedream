import mboum from "../../mboum.app.mjs";

export default {
  key: "mboum-get-modules",
  name: "Get Stock Modules",
  description: "Get comprehensive stock data modules including financial metrics, statistics, and company information. [See the documentation](https://docs.mboum.com/#stocks-options-small-stylecolor-f8f2f2background-fa256fpadding-1px-4pxborder-radius-3pxhotsmall-GETapi-v1-markets-stock-modules)",
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
    module: {
      type: "string",
      label: "Module",
      description: "Specific module to retrieve data for",
      options: [
        "profile",
        "income-statement",
        "income-statement-v2",
        "balance-sheet",
        "balance-sheet-v2",
        "cashflow-statement",
        "cashflow-statement-v2",
        "financial-data",
        "statistics",
        "ratios",
        "calendar-events",
        "sec-filings",
        "recommendation-trend",
        "upgrade-downgrade-history",
        "insider-transactions",
        "insider-holders",
        "net-share-purchase-activity",
        "earnings",
        "index-trend",
        "industry-trend",
        "sector-trend",
      ],
    },
    timeframe: {
      type: "string",
      label: "Timeframe",
      description: "Timeframe for the data",
      options: [
        "annually",
        "quarterly",
        "trailing",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.mboum.getModules({
      $,
      params: {
        ticker: this.ticker,
        module: this.module,
        timeframe: this.timeframe,
      },
    });

    const moduleText = this.module
      ? ` (${this.module} module)`
      : "";
    $.export("$summary", `Successfully retrieved stock modules for ${this.ticker}${moduleText}`);
    return response;
  },
};
