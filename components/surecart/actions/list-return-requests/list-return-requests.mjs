import surecart from "../../surecart.app.mjs";

export default {
  key: "surecart-list-return-requests",
  name: "List Return Requests",
  description: "Return a list of return requests. [See the documentation](https://developer.surecart.com/api-reference/return-requests/list)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    surecart,

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
    status: {
      type: "string[]",
      label: "Status",
      description: "Filter return requests by status.",
      optional: true,
      options: [
        "open",
        "complete",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.surecart.listReturnRequests({
      $,
      params: {
        "ids[]": this.ids,
        "limit": this.limit,
        "order_ids[]": this.orderIds,
        "page": this.page,
        "status[]": this.status,
      },
    });
    $.export("$summary", `Successfully retrieved ${response.data?.length ?? 0} return request(s)`);
    return response;
  },
};
