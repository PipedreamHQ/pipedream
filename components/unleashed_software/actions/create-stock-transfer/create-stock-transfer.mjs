import unleashedSoftware from "../../unleashed_software.app.mjs";

export default {
  key: "unleashed_software-create-stock-transfer",
  name: "Create Stock Transfer",
  description: "Create a stock transfer. [See the documentation](https://apidocs.unleashedsoftware.com/WarehouseStockTransfers)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    unleashedSoftware,
    sourceWarehouseId: {
      propDefinition: [
        unleashedSoftware,
        "warehouseId",
      ],
    },
    destinationWarehouseId: {
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
    quantity: {
      type: "string",
      label: "Quantity",
      description: "The quantity of the product to transfer",
    },
  },
  async run({ $ }) {
    const response = await this.unleashedSoftware.createStockTransfer({
      $,
      data: {
        SourceWarehouse: {
          Guid: this.sourceWarehouseId,
        },
        DestinationWarehouse: {
          Guid: this.destinationWarehouseId,
        },
        TransferDetails: [
          {
            Product: {
              Guid: this.productId,
            },
            TransferQuantity: +this.quantity,
          },
        ],
      },
    });

    $.export("$summary", "Successfully created stock transfer");
    return response;
  },
};
