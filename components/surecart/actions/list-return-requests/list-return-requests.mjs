import surecart from "../../surecart.app.mjs";

export default {
  key: "surecart-list-return-requests",
  name: "List Return Requests",
  description: "Return a list of return requests. [See the documentation](https://developer.surecart.com/api-reference/return-requests/list)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    surecart,

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
    orderIds: {
      type: "string[]",
      label: "Order IDs",
      description: "Filter by order IDs. Use **List Orders** to find order IDs. Example: `[\"ord_abc123\"]`",
      optional: true,
    },
    page: {
      propDefinition: [
        surecart,
        "page",
      ],
    },
    status: {
      type: "string[]",
      label: "Status",
      description: "Filter return requests by status. Valid values: `open`, `complete`. Example: `[\"open\"]` or `[\"open\",\"complete\"]`",
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
