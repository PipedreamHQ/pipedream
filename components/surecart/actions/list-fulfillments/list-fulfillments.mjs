import surecart from "../../surecart.app.mjs";

export default {
  key: "surecart-list-fulfillments",
  name: "List Fulfillments",
  description: "Return a list of fulfillments. [See the documentation](https://developer.surecart.com/api-reference/fulfillments/list)",
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
    shipmentStatus: {
      type: "string[]",
      label: "Shipment Status",
      description: "Filter fulfillments by shipment status. Example: `[\"shipped\"]`",
      optional: true,
    },
  },
  async run({ $ }) {
    const results = this.surecart.paginate({
      fn: this.surecart.listFulfillments,
      args: {
        $,
        params: {
          "ids[]": this.ids,
          "order_ids[]": this.orderIds,
          "shipment_status[]": this.shipmentStatus,
        },
      },
      max: this.maxResults,
    });

    const fulfillments = [];
    for await (const fulfillment of results) {
      fulfillments.push(fulfillment);
    }

    $.export("$summary", `Successfully retrieved ${fulfillments.length} fulfillment(s)`);
    return fulfillments;
  },
};
