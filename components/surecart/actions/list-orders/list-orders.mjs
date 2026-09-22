import surecart from "../../surecart.app.mjs";

export default {
  key: "surecart-list-orders",
  name: "List Orders",
  description: "Return a list of orders. [See the documentation](https://developer.surecart.com/api-reference/orders/list)",
  version: "1.0.0",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    surecart,
    checkoutIds: {
      propDefinition: [
        surecart,
        "checkoutIds",
      ],
    },
    customerIds: {
      propDefinition: [
        surecart,
        "customerIds",
      ],
    },
    fulfillmentStatus: {
      type: "string[]",
      label: "Fulfillment Status",
      description: "Filter orders by fulfillment status. Example: `[\"fulfilled\"]`",
      optional: true,
    },
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
    liveMode: {
      propDefinition: [
        surecart,
        "liveMode",
      ],
    },
    orderType: {
      type: "string[]",
      label: "Order Type",
      description: "Filter orders by type. Example: `[\"renewal\"]`",
      optional: true,
    },
    productIds: {
      propDefinition: [
        surecart,
        "productIds",
      ],
    },
    query: {
      type: "string",
      label: "Query",
      description: "Full-text search query to filter orders. Example: `John`",
      optional: true,
    },
    returnStatus: {
      type: "string[]",
      label: "Return Status",
      description: "Filter orders by return status. Example: `[\"requested\"]`",
      optional: true,
    },
    shipmentStatus: {
      type: "string[]",
      label: "Shipment Status",
      description: "Filter orders by shipment status. Example: `[\"shipped\"]`",
      optional: true,
    },
    status: {
      type: "string[]",
      label: "Status",
      description: "Filter orders by status. Example: `[\"paid\"]`",
      optional: true,
    },
  },
  async run({ $ }) {
    const results = this.surecart.paginate({
      fn: this.surecart.listOrders,
      args: {
        $,
        params: {
          "checkout_ids[]": this.checkoutIds,
          "customer_ids[]": this.customerIds,
          "fulfillment_status[]": this.fulfillmentStatus,
          "ids[]": this.ids,
          "live_mode": this.liveMode,
          "order_type[]": this.orderType,
          "product_ids[]": this.productIds,
          "query": this.query,
          "return_status[]": this.returnStatus,
          "shipment_status[]": this.shipmentStatus,
          "status[]": this.status,
        },
      },
      max: this.maxResults,
    });

    const orders = [];
    for await (const order of results) {
      orders.push(order);
    }

    $.export("$summary", `Successfully retrieved ${orders.length} order(s)`);
    return orders;
  },
};
