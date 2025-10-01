import mboum from "../../mboum.app.mjs";

export default {
  key: "mboum-get-iv-change",
  name: "Get IV Change",
  description: "Get Implied Volatility (IV) change data showing volatility movements and trends over time. [See the documentation](https://docs.mboum.com/#stocks-options-small-stylecolor-f8f2f2background-fa256fpadding-1px-4pxborder-radius-3pxhotsmall-GETapi-v1-markets-options-iv-change)",
  version: "0.0.3",
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
      description: "Type of IV change to retrieve",
      options: [
        "STOCKS",
        "ETFS",
        "INDICES",
      ],
    },
    direction: {
      type: "string",
      label: "Direction",
      description: "Direction of to sort by",
      options: [
        "UP",
        "DOWN",
      ],
      optional: true,
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
    const response = await this.mboum.getIvChange({
      $,
      params: {
        type: this.type,
        direction: this.direction,
        price_min: this.priceMin,
        page: this.page,
      },
    });

    $.export("$summary", "Successfully retrieved IV change data");
    return response;
  },
};
