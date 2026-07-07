import surecart from "../../surecart.app.mjs";

export default {
  key: "surecart-list-return-requests",
  name: "List Return Requests",
  description: "Return a list of return requests. [See the documentation](https://developer.surecart.com/api-reference/return-requests/list)",
  version: "1.0.0",
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
    maxResults: {
      propDefinition: [
        surecart,
        "maxResults",
      ],
    },
    orderIds: {
      type: "string[]",
      label: "Order IDs",
      description: "Filter by order IDs. Use **List Orders** to find order IDs. Example: `[\"b47ca4c2-6cd2-41d5-aefb-4dc459642c56\"]`",
      optional: true,
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
    const results = this.surecart.paginate({
      fn: this.surecart.listReturnRequests,
      args: {
        $,
        params: {
          "ids[]": this.ids,
          "order_ids[]": this.orderIds,
          "status[]": this.status,
        },
      },
      max: this.maxResults,
    });

    const returnRequests = [];
    for await (const returnRequest of results) {
      returnRequests.push(returnRequest);
    }

    $.export("$summary", `Successfully retrieved ${returnRequests.length} return request(s)`);
    return returnRequests;
  },
};
