import mboum from "../../mboum.app.mjs";

export default {
  key: "mboum-get-stock-splits",
  name: "Get Stock Splits",
  description: "Get upcoming and historical stock split data including split ratios, dates, and company information. [See the documentation](https://docs.mboum.com/#stocks-options-small-stylecolor-f8f2f2background-fa256fpadding-1px-4pxborder-radius-3pxhotsmall-GETapi-v1-markets-calendar-stock-splits)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    mboum,
    date: {
      propDefinition: [
        mboum,
        "date",
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
    const response = await this.mboum.getStockSplits({
      $,
      params: {
        date: this.date,
        page: this.page,
      },
    });

    $.export("$summary", "Successfully retrieved stock splits data");
    return response;
  },
};
