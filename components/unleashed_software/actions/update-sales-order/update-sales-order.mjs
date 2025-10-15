import unleashedSoftware from "../../unleashed_software.app.mjs";

export default {
  key: "unleashed_software-update-sales-order",
  name: "Update Sales Order",
  description: "Updates an existing sales order. [See the documentation](https://apidocs.unleashedsoftware.com/SalesOrders)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    unleashedSoftware,
    salesOrderId: {
      propDefinition: [
        unleashedSoftware,
        "salesOrderId",
      ],
    },
    exchangeRate: {
      propDefinition: [
        unleashedSoftware,
        "exchangeRate",
      ],
      optional: true,
    },
    orderStatus: {
      propDefinition: [
        unleashedSoftware,
        "salesOrderStatus",
      ],
      optional: true,
    },
    warehouseId: {
      propDefinition: [
        unleashedSoftware,
        "warehouseId",
      ],
      optional: true,
    },
    comments: {
      propDefinition: [
        unleashedSoftware,
        "comments",
      ],
    },
  },
  async run({ $ }) {
    const salesOrder = await this.unleashedSoftware.getSalesOrder({
      $,
      salesOrderId: this.salesOrderId,
    });

    const taxRate = await this.unleashedSoftware.getTaxRateFromCode({
      $,
      taxCode: salesOrder.Tax.TaxCode,
    });

    const response = await this.unleashedSoftware.updateSalesOrder({
      $,
      salesOrderId: this.salesOrderId,
      data: {
        ExchangeRate: this.exchangeRate
          ? +this.exchangeRate
          : salesOrder.ExchangeRate,
        OrderStatus: this.orderStatus || salesOrder.OrderStatus,
        Warehouse: {
          Guid: this.warehouseId || salesOrder.Warehouse.Guid,
        },
        Comments: this.comments,
        SubTotal: salesOrder.SubTotal,
        Tax: {
          TaxCode: salesOrder.Tax.TaxCode,
        },
        TaxRate: taxRate,
        TaxTotal: salesOrder.TaxTotal,
        Total: salesOrder.Total,
      },
    });

    $.export("$summary", "Successfully updated sales order");
    return response;
  },
};
