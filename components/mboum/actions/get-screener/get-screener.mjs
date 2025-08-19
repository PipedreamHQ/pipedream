import mboum from "../../mboum.app.mjs";

export default {
  key: "mboum-get-screener",
  name: "Get Stock Screener Results",
  description: "Screen stocks based on various financial criteria and filters. [See the documentation](https://docs.mboum.com/#stocks-options-small-stylecolor-f8f2f2background-fa256fpadding-1px-4pxborder-radius-3pxhotsmall-GETapi-v2-markets-screener)",
  version: "0.0.1",
  type: "action",
  props: {
    mboum,
    metricType: {
      type: "string",
      label: "Metric Type",
      description: "Type of metric to use for screening",
      options: [
        "overview",
        "technical",
        "performance",
        "fundamental",
      ],
    },
    filter: {
      type: "string",
      label: "Filter",
      description: "Filter to apply to the screener. [See the documentation](https://docs.mboum.com/#stocks-options-small-stylecolor-f8f2f2background-fa256fpadding-1px-4pxborder-radius-3pxhotsmall-GETapi-v2-markets-screener) for more information about screeners",
      options: [
        "high_volume",
        "hot_stocks",
        "top_under_10",
        "dividend",
        "top_fundamentals",
        "top_tech",
        "j_pattern",
        "golden_cross",
        "death_cross",
        "consolidation",
        "rsi_overbought",
        "rsi_oversold",
        "52wk_toppicks",
        "penny_gap",
        "defensive_stock",
        "income_growth",
        "buy_longterm",
        "sell_growth",
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
    const response = await this.mboum.getScreener({
      $,
      params: {
        metricType: this.metricType,
        filter: this.filter,
        page: this.page,
      },
    });

    $.export("$summary", "Successfully screened stocks");
    return response;
  },
};
