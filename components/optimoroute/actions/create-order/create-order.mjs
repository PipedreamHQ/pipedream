import optimoroute from "../../optimoroute.app.mjs";

export default {
  key: "optimoroute-create-order",
  name: "Create Order",
  description: "Create a new order. [See the documentation](https://optimoroute.com/api/#create-order)",
  type: "action",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    optimoroute,
    type: {
      type: "string",
      label: "Type",
      description: "The type of order to create",
      options: [
        {
          label: "Delivery",
          value: "D",
        },
        {
          label: "Pickup",
          value: "P",
        },
        {
          label: "Task",
          value: "T",
        },
      ],
    },
    date: {
      type: "string",
      label: "Date",
      description: "YYYY-MM-DD format, for example `2013-12-20`",
    },
    address: {
      type: "string",
      label: "Address",
      description: "The full address including the country, for example `393 Hanover St, Boston, MA 02113, US`",
    },
    orderNo: {
      type: "string",
      label: "Order Number",
      description: "A user specified order identifier, also displayed in the web application",
    },
    priority: {
      type: "string",
      label: "Priority",
      description: "The priority of the order",
      options: [
        {
          label: "Low",
          value: "L",
        },
        {
          label: "Medium",
          value: "M",
        },
        {
          label: "High",
          value: "H",
        },
        {
          label: "Critical",
          value: "C",
        },
      ],
    },
    email: {
      type: "string",
      label: "Email",
      description: "The customer email",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "The customer phone number",
      optional: true,
    },
    notes: {
      type: "string",
      label: "Notes",
      description: "A note that will accompany the driver's instructions",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.optimoroute.createOrder({
      $,
      data: {
        operation: "CREATE",
        type: this.type,
        date: this.date,
        location: {
          address: this.address,
        },
        orderNo: this.orderNo,
        priority: this.priority,
        email: this.email,
        phone: this.phone,
        notes: this.notes,
      },
    });
    $.export("$summary", `Successfully created order with ID: ${response.id}`);
    return response;
  },
};
