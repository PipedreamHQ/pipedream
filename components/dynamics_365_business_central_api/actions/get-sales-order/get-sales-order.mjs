import dynamics from "../../dynamics_365_business_central_api.app.mjs";

export default {
  key: "dynamics_365_business_central_api-get-sales-order",
  name: "Get Sales Order",
  description: "Retrieves a sales order by ID. [See the documentation](https://learn.microsoft.com/en-us/dynamics365/business-central/dev-itpro/api-reference/v2.0/api/dynamics_salesorder_get)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    dynamics,
    companyId: {
      propDefinition: [
        dynamics,
        "companyId",
      ],
    },
    salesOrderId: {
      propDefinition: [
        dynamics,
        "salesOrderId",
        (c) => ({
          companyId: c.companyId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.dynamics.getSalesOrder({
      $,
      companyId: this.companyId,
      salesOrderId: this.salesOrderId,
    });
    $.export("$summary", `Successfully retrieved sales order with ID ${this.salesOrderId}`);
    return response;
  },
};
