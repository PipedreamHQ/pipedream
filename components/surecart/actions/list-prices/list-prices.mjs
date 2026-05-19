import surecart from "../../surecart.app.mjs";

export default {
  key: "surecart-list-prices",
  name: "List Prices",
  description: "Return a list of prices. [See the documentation](https://developer.surecart.com/api-reference/prices/list)",
  version: "0.0.1",
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
    limit: {
      propDefinition: [
        surecart,
        "limit",
      ],
    },
    page: {
      propDefinition: [
        surecart,
        "page",
      ],
    },
    productIds: {
      type: "string[]",
      label: "Product IDs",
      description: "Filter by product IDs. Use **List Products** to find product IDs. Example: `[\"prod_abc123\"]`",
      optional: true,
    },
    sort: {
      type: "string",
      label: "Sort",
      description: "Sort column and direction. Example: `amount asc`",
      optional: true,
      options: [
        "amount asc",
        "amount desc",
        "created_at asc",
        "created_at desc",
        "updated_at asc",
        "updated_at desc",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.surecart.listPrices({
      $,
      params: {
        "ad_hoc": this.adHoc,
        "archived": this.archived,
        "ids[]": this.ids,
        "limit": this.limit,
        "page": this.page,
        "product_ids[]": this.productIds,
        "sort": this.sort,
      },
    });
    $.export("$summary", `Successfully retrieved ${response.data?.length ?? 0} price(s)`);
    return response;
  },
};
