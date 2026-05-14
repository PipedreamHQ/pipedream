import surecart from "../../surecart.app.mjs";

export default {
  key: "surecart-list-orders",
  name: "List Orders",
  description: "Return a list of orders. [See the documentation](https://developer.surecart.com/api-reference/orders/list)",
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
    customerIds: {
      type: "string[]",
      label: "Customer IDs",
      description: "Filter by customer IDs. Use **List Customers** to find customer IDs. Example: `[\"cus_abc123\"]`",
      optional: true,
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
    limit: {
      propDefinition: [
        surecart,
        "limit",
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
    page: {
      propDefinition: [
        surecart,
        "page",
      ],
    },
    productIds: {
      type: "string[]",
      label: "Product IDs",
      description: "Filter by product IDs. Use **List Products** to find product IDs. Example: `[\"prod_abc123\"]`",
      optional: true,
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
    const response = await this.surecart.listOrders({
      $,
      params: {
        "checkout_ids[]": this.checkoutIds,
        "customer_ids[]": this.customerIds,
        "fulfillment_status[]": this.fulfillmentStatus,
        "ids[]": this.ids,
        "limit": this.limit,
        "live_mode": this.liveMode,
        "order_type[]": this.orderType,
        "page": this.page,
        "product_ids[]": this.productIds,
        "query": this.query,
        "return_status[]": this.returnStatus,
        "shipment_status[]": this.shipmentStatus,
        "status[]": this.status,
      },
    });
    $.export("$summary", `Successfully retrieved ${response.data?.length ?? 0} order(s)`);
    return response;
  },
};
