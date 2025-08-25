import mboum from "../../mboum.app.mjs";

export default {
  key: "mboum-get-iv-rank-percentile",
  name: "Get IV Rank Percentile",
  description: "Get Implied Volatility (IV) rank and percentile data for options to assess volatility levels. [See the documentation](https://docs.mboum.com/#stocks-options-small-stylecolor-f8f2f2background-fa256fpadding-1px-4pxborder-radius-3pxhotsmall-GETapi-v1-markets-options-iv-rank-percentile)",
  version: "0.0.2",
  type: "action",
  props: {
    mboum,
    type: {
      type: "string",
      label: "Type",
      description: "Type of IV rank percentile to retrieve",
      options: [
        "STOCKS",
        "ETFS",
        "INDICES",
      ],
    },
    priceMin: {
      type: "string",
      label: "Price Min",
      description: "Filter results by min price of the stock per share value",
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
    const response = await this.mboum.getIvRankPercentile({
      $,
      params: {
        type: this.type,
        price_min: this.priceMin,
        page: this.page,
      },
    });

    $.export("$summary", "Successfully retrieved IV rank percentile data");
    return response;
  },
};
