import surecart from "../../surecart.app.mjs";

export default {
  key: "surecart-list-invoices",
  name: "List Invoices",
  description: "Return a list of invoices. [See the documentation](https://developer.surecart.com/api-reference/invoices/list)",
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
    query: {
      type: "string",
      label: "Query",
      description: "Full-text search query to filter invoices. Example: `INV-001`",
      optional: true,
    },
    status: {
      type: "string[]",
      label: "Status",
      description: "Filter invoices by status. Example: `[\"paid\"]`",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.surecart.listInvoices({
      $,
      params: {
        "customer_ids[]": this.customerIds,
        "ids[]": this.ids,
        "limit": this.limit,
        "live_mode": this.liveMode,
        "page": this.page,
        "query": this.query,
        "status[]": this.status,
      },
    });
    $.export("$summary", `Successfully retrieved ${response.data?.length ?? 0} invoice(s)`);
    return response;
  },
};
