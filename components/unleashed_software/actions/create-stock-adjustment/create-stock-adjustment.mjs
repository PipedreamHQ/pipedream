import unleashedSoftware from "../../unleashed_software.app.mjs";

export default {
  key: "unleashed_software-create-stock-adjustment",
  name: "Create Stock Adjustment",
  description: "Create a stock adjustment. [See the documentation](https://apidocs.unleashedsoftware.com/StockAdjustments)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    unleashedSoftware,
    adjustmentReason: {
      type: "string",
      label: "Adjustment Reason",
      description: "The reason for the stock adjustment",
      options: [
        "End of Season",
        "Samples",
        "Stolen",
      ],
    },
    warehouseId: {
      propDefinition: [
        unleashedSoftware,
        "warehouseId",
      ],
    },
    productId: {
      propDefinition: [
        unleashedSoftware,
        "productId",
      ],
    },
    newQuantity: {
      type: "string",
      label: "New Quantity",
      description: "The new quantity of the product",
    },
    newActualValue: {
      type: "string",
      label: "New Actual Value",
      description: "The new actual value of the product",
    },
  },
  async run({ $ }) {
    const response = await this.unleashedSoftware.createStockAdjustment({
      $,
      data: {
        AdjustmentReason: this.adjustmentReason,
        Warehouse: {
          Guid: this.warehouseId,
        },
        StockAdjustmentLines: [
          {
            Product: {
              Guid: this.productId,
            },
            NewQuantity: +this.newQuantity,
            NewActualValue: +this.newActualValue,
          },
        ],
      },
    });

    $.export("$summary", "Successfully created stock adjustment");
    return response;
  },
};
