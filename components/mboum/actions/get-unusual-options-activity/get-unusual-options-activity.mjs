import mboum from "../../mboum.app.mjs";

export default {
  key: "mboum-get-unusual-options-activity",
  name: "Get Unusual Options Activity",
  description: "Get unusual options activity including high volume and large trades that deviate from normal patterns. [See the documentation](https://docs.mboum.com/#stocks-options-small-stylecolor-f8f2f2background-fa256fpadding-1px-4pxborder-radius-3pxhotsmall-GETapi-v1-markets-options-unusual-options-activity)",
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
      description: "Type of unusual options activity to retrieve",
      options: [
        "STOCKS",
        "ETFS",
        "INDICES",
      ],
    },
    ticker: {
      propDefinition: [
        mboum,
        "ticker",
      ],
    },
    date: {
      type: "string",
      label: "Date",
      description: "Enter a historical date: YYYY-MM-DD",
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
    const response = await this.mboum.getUnusualOptionsActivity({
      $,
      params: {
        type: this.type,
        ticker: this.ticker,
        date: this.date,
        price_min: this.priceMin,
        page: this.page,
      },
    });

    $.export("$summary", "Successfully retrieved unusual options activity");
    return response;
  },
};
