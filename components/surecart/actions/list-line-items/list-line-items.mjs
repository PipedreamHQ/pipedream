import surecart from "../../surecart.app.mjs";

export default {
  key: "surecart-list-line-items",
  name: "List Line Items",
  description: "Retrieves a paginated list of line items from SureCart. Use to inspect items added to checkouts, audit configurations, or filter by checkout or line item IDs; to find valid checkout IDs, use **List Checkouts**; returns up to 100 items per page and supports pagination parameters. [See the documentation](https://developer.surecart.com/api-reference/line-items/list)",
  version: "0.0.2",
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
    page: {
      type: "integer",
      label: "Page",
      description: "Page number for pagination. Example: `1`",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.surecart.listLineItems({
      $,
      params: {
        "checkout_ids[]": this.checkoutIds,
        "ids[]": this.ids,
        "limit": this.limit,
        "page": this.page,
      },
    });
    $.export("$summary", `Successfully retrieved ${response.data?.length ?? 0} line item(s)`);
    return response;
  },
};
