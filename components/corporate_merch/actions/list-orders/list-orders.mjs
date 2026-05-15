import corporateMerch from "../../corporate_merch.app.mjs";

export default {
  key: "corporate_merch-list-orders",
  name: "List Orders",
  description: "Retrieve a list of orders. [See the documentation](https://corporatemerch.readme.io/reference/list-orders)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    corporateMerch,
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of results to return per page. Must be ≤ 50. Defaults to `15`.",
      optional: true,
    },
    page: {
      type: "integer",
      label: "Page",
      description: "Page number to return for pagination.",
      optional: true,
    },
    shopifyOrderId: {
      type: "string",
      label: "Shopify Order ID",
      description: "Filter orders by Shopify order ID.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.corporateMerch.listOrders({
      $,
      params: {
        limit: this.limit,
        page: this.page,
        shopify_order_id: this.shopifyOrderId,
      },
    });
    $.export("$summary", `Successfully retrieved ${response.data?.length ?? response.length ?? 0} order(s)`);
    return response;
  },
};
