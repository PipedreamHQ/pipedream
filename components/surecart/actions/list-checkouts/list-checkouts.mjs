import surecart from "../../surecart.app.mjs";

export default {
  key: "surecart-list-checkouts",
  name: "List Checkouts",
  description: "Return a list of checkouts. [See the documentation](https://developer.surecart.com/api-reference/checkouts/list)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    surecart,
    customerIds: {
      type: "string[]",
      label: "Customer IDs",
      description: "Filter by customer IDs. Use **List Customers** to find customer IDs. Example: `[\"cus_abc123\"]`",
      optional: true,
    },
    groupKeys: {
      type: "string[]",
      label: "Group Keys",
      description: "Filter checkouts by group keys. Example: `[\"key_abc\"]`",
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
    productIds: {
      type: "string[]",
      label: "Product IDs",
      description: "Filter by product IDs. Use **List Products** to find product IDs. Example: `[\"prod_abc123\"]`",
      optional: true,
    },
    status: {
      type: "string[]",
      label: "Status",
      description: "Filter checkouts by status. Example: `[\"complete\"]`",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.surecart.listCheckouts({
      $,
      params: {
        "customer_ids[]": this.customerIds,
        "group_keys[]": this.groupKeys,
        "ids[]": this.ids,
        "limit": this.limit,
        "live_mode": this.liveMode,
        "page": this.page,
        "product_ids[]": this.productIds,
        "status[]": this.status,
      },
    });
    $.export("$summary", `Successfully retrieved ${response.data?.length ?? 0} checkout(s)`);
    return response;
  },
};
