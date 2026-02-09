import app from "../../nuvemshop.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "nuvemshop-get-orders",
  name: "Get Orders",
  description: "Retrieves a list of orders. [See the documentation](https://tiendanube.github.io/api-documentation/resources/order#get-orders)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    q: {
      type: "string",
      label: "Search Query",
      description: "Search orders by order number, customer name, or customer email",
      optional: true,
    },
    status: {
      type: "string",
      label: "Order Status",
      description: "Filter by order status",
      options: constants.ORDER_STATUS,
      optional: true,
    },
    paymentStatus: {
      type: "string",
      label: "Payment Status",
      description: "Filter by payment status",
      options: constants.PAYMENT_STATUS,
      optional: true,
    },
    shippingStatus: {
      type: "string",
      label: "Shipping Status",
      description: "Filter by shipping status",
      options: constants.SHIPPING_STATUS,
      optional: true,
    },
    createdAtMin: {
      type: "string",
      label: "Created At Min",
      description: "Show orders created after this date (ISO 8601 format). Example: `2025-01-01`",
      optional: true,
    },
    createdAtMax: {
      type: "string",
      label: "Created At Max",
      description: "Show orders created before this date (ISO 8601 format). Example: `2025-01-01`",
      optional: true,
    },
    updatedAtMin: {
      type: "string",
      label: "Updated At Min",
      description: "Show orders updated after this date (ISO 8601 format). Example: `2025-01-01`",
      optional: true,
    },
    updatedAtMax: {
      type: "string",
      label: "Updated At Max",
      description: "Show orders updated before this date (ISO 8601 format). Example: `2025-01-01`",
      optional: true,
    },
    fields: {
      type: "string",
      label: "Fields",
      description: "Comma-separated list of fields to include in the response",
      optional: true,
    },
    max: {
      type: "integer",
      label: "Max Results",
      description: "Maximum number of orders to return. Leave blank to retrieve all orders.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      q,
      status,
      paymentStatus,
      shippingStatus,
      createdAtMin,
      createdAtMax,
      updatedAtMin,
      updatedAtMax,
      fields,
      max,
    } = this;

    const orders = [];
    const paginator = app.paginate({
      resourceFn: app.listOrders,
      params: {
        q,
        status,
        payment_status: paymentStatus,
        shipping_status: shippingStatus,
        created_at_min: createdAtMin,
        created_at_max: createdAtMax,
        updated_at_min: updatedAtMin,
        updated_at_max: updatedAtMax,
        fields,
      },
      max,
    });

    for await (const order of paginator) {
      orders.push(order);
    }

    $.export("$summary", `Successfully retrieved ${orders.length} order${orders.length === 1
      ? ""
      : "s"}`);
    return orders;
  },
};
