import optimoroute from "../../optimoroute.app.mjs";

export default {
  key: "optimoroute-update-order-status",
  name: "Update Order Status",
  description: "Update the status of an order. [See the documentation](https://optimoroute.com/api/#update-order-completion)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    optimoroute,
    orderNo: {
      type: "string",
      label: "Order Number",
      description: "The number of the order to update",
    },
    status: {
      type: "string",
      label: "Status",
      description: "The status to update the order to",
      options: [
        {
          value: "unscheduled",
          label: "Order has not been scheduled",
        },
        {
          value: "scheduled",
          label: "Order has not been started yet",
        },
        {
          value: "on_route",
          label: "Driver is on their way to order location",
        },
        {
          value: "servicing",
          label: "Order is currently being serviced",
        },
        {
          value: "success",
          label: "Order was completed successfully",
        },
        {
          value: "failed",
          label: "Driver failed to complete the order",
        },
        {
          value: "rejected",
          label: "Order was rejected by the driver",
        },
        {
          value: "cancelled",
          label: "Order was cancelled by customer",
        },
      ],
    },
  },
  async run({ $ }) {
    const response = await this.optimoroute.updateOrderStatus({
      $,
      data: {
        updates: [
          {
            orderNo: this.orderNo,
            data: {
              status: this.status,
            },
          },
        ],
      },
    });
    $.export("$summary", `Successfully updated order status to ${this.status} for order number: ${this.orderNo}`);
    return response;
  },
};
