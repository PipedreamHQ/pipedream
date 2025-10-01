import mboum from "../../mboum.app.mjs";

export default {
  key: "mboum-get-movers",
  name: "Get Market Movers",
  description: "Get top market movers including gainers, losers, and most active stocks. [See the documentation](https://docs.mboum.com/#stocks-options-small-stylecolor-f8f2f2background-fa256fpadding-1px-4pxborder-radius-3pxhotsmall-GETapi-v2-markets-movers)",
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
      label: "Mover Type",
      description: "Type of market movers to retrieve",
      options: [
        "PERCENT",
        "PRICE",
        "GAP",
      ],
    },
    direction: {
      type: "string",
      label: "Direction",
      description: "Direction of the movers to retrieve",
      options: [
        "UP",
        "DOWN",
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
    const response = await this.mboum.getMovers({
      $,
      params: {
        type: this.type,
        direction: this.direction,
        price_min: this.priceMin,
        page: this.page,
      },
    });

    $.export("$summary", "Successfully retrieved movers");
    return response;
  },
};
