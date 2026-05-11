import surecart from "../../surecart.app.mjs";

export default {
  key: "surecart-list-subscriptions",
  name: "List Subscriptions",
  description: "Return a list of subscriptions. [See the documentation](https://developer.surecart.com/api-reference/subscriptions/list)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    surecart,
    checkoutIds: {
      type: "string[]",
      label: "Checkout IDs",
      description: "Filter by checkout IDs. Use **List Checkouts** to find checkout IDs. Example: `[\"ch_abc123\"]`",
      optional: true,
    },
    customerIds: {
      type: "string[]",
      label: "Customer IDs",
      description: "Filter by customer IDs. Use **List Customers** to find customer IDs. Example: `[\"cus_abc123\"]`",
      optional: true,
    },
    finite: {
      type: "boolean",
      label: "Finite",
      description: "Set to `true` to return only finite (fixed-length) subscriptions, or `false` for indefinite subscriptions.",
      optional: true,
    },
    ids: {
      type: "string[]",
      label: "IDs",
      description: "Filter by specific IDs. Example: `[\"id_abc123\", \"id_def456\"]`",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Number of results to return per page (1-100). Example: `25`",
      optional: true,
    },
    liveMode: {
      type: "boolean",
      label: "Live Mode",
      description: "Filter by live mode (`true`) or test mode (`false`).",
      optional: true,
    },
    page: {
      type: "integer",
      label: "Page",
      description: "Page number for pagination. Example: `1`",
      optional: true,
    },
    priceIds: {
      type: "string[]",
      label: "Price IDs",
      description: "Filter by price IDs. Example: `[\"price_abc123\"]`",
      optional: true,
    },
    productIds: {
      type: "string[]",
      label: "Product IDs",
      description: "Filter by product IDs. Use **List Products** to find product IDs. Example: `[\"prod_abc123\"]`",
      optional: true,
    },
    purchaseIds: {
      type: "string[]",
      label: "Purchase IDs",
      description: "Filter by purchase IDs. Use **List Purchases** to find purchase IDs. Example: `[\"pur_abc123\"]`",
      optional: true,
    },
    query: {
      type: "string",
      label: "Query",
      description: "Full-text search query to filter subscriptions. Example: `Jane`",
      optional: true,
    },
    status: {
      type: "string[]",
      label: "Status",
      description: "Filter subscriptions by status.",
      optional: true,
      options: [
        "incomplete",
        "trialing",
        "active",
        "past_due",
        "canceled",
        "completed",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.surecart.listSubscriptions({
      $,
      params: {
        "checkout_ids[]": this.checkoutIds,
        "customer_ids[]": this.customerIds,
        "finite": this.finite,
        "ids[]": this.ids,
        "limit": this.limit,
        "live_mode": this.liveMode,
        "page": this.page,
        "price_ids[]": this.priceIds,
        "product_ids[]": this.productIds,
        "purchase_ids[]": this.purchaseIds,
        "query": this.query,
        "status[]": this.status,
      },
    });
    $.export("$summary", `Successfully retrieved ${response.data?.length ?? 0} subscription(s)`);
    return response;
  },
};
