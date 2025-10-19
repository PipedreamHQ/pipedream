import unleashedSoftware from "../../unleashed_software.app.mjs";

export default {
  key: "unleashed_software-get-sales-order",
  name: "Get Sales Order",
  description: "Retrieves a sales order by ID. [See the documentation](https://apidocs.unleashedsoftware.com/SalesOrders)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    unleashedSoftware,
    salesOrderId: {
      propDefinition: [
        unleashedSoftware,
        "salesOrderId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.unleashedSoftware.getSalesOrder({
      $,
      salesOrderId: this.salesOrderId,
    });
    $.export("$summary", `Successfully retrieved sales order with ID ${this.salesOrderId}`);
    return response;
  },
};
