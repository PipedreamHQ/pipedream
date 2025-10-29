import unleashedSoftware from "../../unleashed_software.app.mjs";

export default {
  key: "unleashed_software-update-purchase-order",
  name: "Update Purchase Order",
  description: "Update a purchase order. [See the documentation](https://apidocs.unleashedsoftware.com/Purchases)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    unleashedSoftware,
    purchaseOrderId: {
      propDefinition: [
        unleashedSoftware,
        "purchaseOrderId",
      ],
    },
    orderStatus: {
      propDefinition: [
        unleashedSoftware,
        "purchaseOrderStatus",
      ],
      options: [
        "Parked",
        "Placed",
        "Costed",
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
    exchangeRate: {
      propDefinition: [
        unleashedSoftware,
        "exchangeRate",
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
    const purchaseOrder = await this.unleashedSoftware.getPurchaseOrder({
      $,
      purchaseOrderId: this.purchaseOrderId,
    });

    const taxRate = await this.unleashedSoftware.getTaxRateFromCode({
      $,
      taxCode: purchaseOrder.Tax.TaxCode,
    });

    const response = await this.unleashedSoftware.updatePurchaseOrder({
      $,
      purchaseOrderId: this.purchaseOrderId,
      data: {
        Supplier: {
          Guid: purchaseOrder.Supplier.Guid,
        },
        ExchangeRate: this.exchangeRate
          ? +this.exchangeRate
          : purchaseOrder.ExchangeRate,
        OrderStatus: this.orderStatus || purchaseOrder.OrderStatus,
        Warehouse: {
          Guid: this.warehouseId || purchaseOrder.Warehouse.Guid,
        },
        Comments: this.comments,
        SubTotal: purchaseOrder.SubTotal,
        Tax: {
          TaxCode: purchaseOrder.Tax.TaxCode,
        },
        TaxRate: taxRate,
        TaxTotal: purchaseOrder.TaxTotal,
        Total: purchaseOrder.Total,
      },
    });

    $.export("$summary", "Successfully updated purchase order");
    return response;
  },
};
