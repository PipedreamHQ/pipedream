import app from "../../lightspeed_ecom_c_series.app.mjs";

export default {
  key: "lightspeed_ecom_c_series-find-order",
  name: "Find Order",
  description: "Find an order by ID. [See the documentation](https://developers.lightspeedhq.com/ecom/endpoints/order/#get-all-orders)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    customerId: {
      propDefinition: [
        app,
        "customerId",
      ],
      description: "Retrieve all orders from a specific customer based on the customerid",
      optional: true,
    },
    orderNumber: {
      propDefinition: [
        app,
        "orderNumber",
      ],
      description: "Retrieve an order based on the order number",
      optional: true,
    },
    sinceId: {
      type: "string",
      label: "Since ID",
      description: "Restrict results to after the specified ID",
      optional: true,
    },
    createdAtMin: {
      propDefinition: [
        app,
        "createdAtMin",
      ],
      description: "Show orders created after date. **Format: `YYYY-MM-DD HH:MM:SS`**",
    },
    createdAtMax: {
      propDefinition: [
        app,
        "createdAtMax",
      ],
      description: "Show orders created before date. **Format: `YYYY-MM-DD HH:MM:SS`**",
    },
    updatedAtMin: {
      propDefinition: [
        app,
        "updatedAtMin",
      ],
      description: "Show orders last updated after date. **Format: `YYYY-MM-DD HH:MM:SS`**",
    },
    updatedAtMax: {
      propDefinition: [
        app,
        "updatedAtMax",
      ],
      description: "Show orders last updated before date. **Format: `YYYY-MM-DD HH:MM:SS`**",
    },
  },
  async run({ $ }) {
    const response = this.app.paginate({
      fn: this.app.listOrder,
      $,
      params: {
        customer: this.customerId,
        number: this.orderNumber,
        since_id: this.sinceId,
        created_at_min: this.createdAtMin,
        created_at_max: this.createdAtMax,
        updated_at_min: this.updatedAtMin,
        updated_at_max: this.updatedAtMax,
      },
      dataField: "orders",
    });

    const orders = [];
    for await (const order of response) {
      orders.push(order);
    }

    $.export("$summary", `Successfully found ${orders.length} order${orders.length === 1
      ? ""
      : "s"}`);
    return orders;
  },
};
