import surecart from "../../surecart.app.mjs";

export default {
  key: "surecart-list-purchases",
  name: "List Purchases",
  description: "Return a list of purchases. [See the documentation](https://developer.surecart.com/api-reference/purchases/list)",
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
    createdAtGt: {
      type: "integer",
      label: "Created After (Unix timestamp)",
      description: "Return purchases created after this Unix timestamp. Example: `1700000000`",
      optional: true,
    },
    createdAtGte: {
      type: "integer",
      label: "Created At or After (Unix timestamp)",
      description: "Return purchases created at or after this Unix timestamp. Example: `1700000000`",
      optional: true,
    },
    createdAtLt: {
      type: "integer",
      label: "Created Before (Unix timestamp)",
      description: "Return purchases created before this Unix timestamp. Example: `1710000000`",
      optional: true,
    },
    createdAtLte: {
      type: "integer",
      label: "Created At or Before (Unix timestamp)",
      description: "Return purchases created at or before this Unix timestamp. Example: `1710000000`",
      optional: true,
    },
    customerIds: {
      type: "string[]",
      label: "Customer IDs",
      description: "Filter by customer IDs. Use **List Customers** to find customer IDs. Example: `[\"cus_abc123\"]`",
      optional: true,
    },
    downloadable: {
      type: "boolean",
      label: "Downloadable",
      description: "Filter for purchases that have associated downloads.",
      optional: true,
    },
    ids: {
      type: "string[]",
      label: "IDs",
      description: "Filter by specific IDs. Example: `[\"id_abc123\", \"id_def456\"]`",
      optional: true,
    },
    licenseIds: {
      type: "string[]",
      label: "License IDs",
      description: "Filter by license IDs. Example: `[\"lic_abc123\"]`",
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
    orderIds: {
      type: "string[]",
      label: "Order IDs",
      description: "Filter by order IDs. Use **List Orders** to find order IDs. Example: `[\"ord_abc123\"]`",
      optional: true,
    },
    page: {
      type: "integer",
      label: "Page",
      description: "Page number for pagination. Example: `1`",
      optional: true,
    },
    productIds: {
      type: "string[]",
      label: "Product IDs",
      description: "Filter by product IDs. Use **List Products** to find product IDs. Example: `[\"prod_abc123\"]`",
      optional: true,
    },
    revoked: {
      type: "boolean",
      label: "Revoked",
      description: "Filter by revocation status. Set to `true` to return only revoked purchases.",
      optional: true,
    },
    subscriptionIds: {
      type: "string[]",
      label: "Subscription IDs",
      description: "Filter by subscription IDs. Use **List Subscriptions** to find subscription IDs. Example: `[\"sub_abc123\"]`",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.surecart.listPurchases({
      $,
      params: {
        "checkout_ids[]": this.checkoutIds,
        "created_at": (this.createdAtGt !== undefined || this.createdAtGte !== undefined || this.createdAtLt !== undefined || this.createdAtLte !== undefined)
          ? {
            gt: this.createdAtGt,
            gte: this.createdAtGte,
            lt: this.createdAtLt,
            lte: this.createdAtLte,
          }
          : undefined,
        "customer_ids[]": this.customerIds,
        "downloadable": this.downloadable,
        "ids[]": this.ids,
        "license_ids[]": this.licenseIds,
        "limit": this.limit,
        "live_mode": this.liveMode,
        "order_ids[]": this.orderIds,
        "page": this.page,
        "product_ids[]": this.productIds,
        "revoked": this.revoked,
        "subscription_ids[]": this.subscriptionIds,
      },
    });
    $.export("$summary", `Successfully retrieved ${response.data?.length ?? 0} purchase(s)`);
    return response;
  },
};
