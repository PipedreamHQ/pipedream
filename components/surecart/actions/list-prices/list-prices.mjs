import surecart from "../../surecart.app.mjs";

export default {
  key: "surecart-list-prices",
  name: "List Prices",
  description: "Return a list of prices. [See the documentation](https://developer.surecart.com/api-reference/prices/list)",
  version: "0.1.0",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    surecart,
    adHoc: {
      type: "boolean",
      label: "Ad Hoc",
      description: "Set to `true` to return only prices that accept custom amounts, or `false` to exclude them.",
      optional: true,
    },
    archived: {
      type: "boolean",
      label: "Archived",
      description: "Set to `true` to return only archived prices, or `false` for active prices.",
      optional: true,
    },
    ids: {
      propDefinition: [
        surecart,
        "ids",
      ],
    },
    maxResults: {
      propDefinition: [
        surecart,
        "maxResults",
      ],
    },
    productIds: {
      type: "string[]",
      label: "Product IDs",
      description: "Filter by product IDs. Use **List Products** to find product IDs. Example: `[\"b47ca4c2-6cd2-41d5-aefb-4dc459642c56\"]`",
      optional: true,
    },
    sort: {
      type: "string",
      label: "Sort",
      description: "Sort column and direction in `column:order` format. Example: `amount:asc`",
      optional: true,
      options: [
        "amount:asc",
        "amount:desc",
        "created_at:asc",
        "created_at:desc",
        "updated_at:asc",
        "updated_at:desc",
      ],
    },
  },
  async run({ $ }) {
    const results = this.surecart.paginate({
      fn: this.surecart.listPrices,
      args: {
        $,
        params: {
          "ad_hoc": this.adHoc,
          "archived": this.archived,
          "ids[]": this.ids,
          "product_ids[]": this.productIds,
          "sort": this.sort,
        },
      },
      max: this.maxResults,
    });

    const prices = [];
    for await (const price of results) {
      prices.push(price);
    }

    $.export("$summary", `Successfully retrieved ${prices.length} price(s)`);
    return prices;
  },
};
