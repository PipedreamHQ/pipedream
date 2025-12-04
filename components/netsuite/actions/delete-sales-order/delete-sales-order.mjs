import app from "../../netsuite.app.mjs";

export default {
  key: "netsuite-delete-sales-order",
  name: "Delete Sales Order",
  description: "Deletes an existing sales order in NetSuite. [See the documentation](https://system.netsuite.com/help/helpcenter/en_US/APIs/REST_API_Browser/record/v1/2025.2/index.html)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
    openWorldHint: true,
    idempotentHint: true,
  },
  props: {
    app,
    salesOrderId: {
      propDefinition: [
        app,
        "salesOrderId",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      salesOrderId,
    } = this;

    const response = await app.deleteSalesOrder({
      $,
      salesOrderId,
    });

    $.export("$summary", `Successfully deleted sales order with ID ${salesOrderId}`);
    return response;
  },
};
