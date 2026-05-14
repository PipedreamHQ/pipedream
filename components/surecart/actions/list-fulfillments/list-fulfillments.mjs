import surecart from "../../surecart.app.mjs";

export default {
  key: "surecart-list-fulfillments",
  name: "List Fulfillments",
  description: "Return a list of fulfillments. [See the documentation](https://developer.surecart.com/api-reference/fulfillments/list)",
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
    shipmentStatus: {
      type: "string[]",
      label: "Shipment Status",
      description: "Filter fulfillments by shipment status. Example: `[\"shipped\"]`",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.surecart.listFulfillments({
      $,
      params: {
        "ids[]": this.ids,
        "limit": this.limit,
        "order_ids[]": this.orderIds,
        "page": this.page,
        "shipment_status[]": this.shipmentStatus,
      },
    });
    $.export("$summary", `Successfully retrieved ${response.data?.length ?? 0} fulfillment(s)`);
    return response;
  },
};
