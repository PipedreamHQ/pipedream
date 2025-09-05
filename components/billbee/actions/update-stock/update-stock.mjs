import app from "../../billbee.app.mjs";

export default {
  key: "billbee-update-stock",
  name: "Update Stock",
  description: "Update the stock level for a single product. [See the documentation](https://app.billbee.io//swagger/ui/index#/Products/Article_UpdateStock)",
  type: "action",
  version: "0.0.1",
  props: {
    app,
    sku: {
      type: "string",
      label: "SKU",
      description: "The SKU of the product to update",
      propDefinition: [
        app,
        "product",
        () => ({
          filter: ({ SKU: sku }) => !!sku,
          mapper: ({
            SKU: value, Title: title,
          }) => ({
            value,
            label: title?.[0]?.Text || "Untitled",
          }),
        }),
      ],
    },
    stockId: {
      propDefinition: [
        app,
        "stockId",
      ],
    },
    billbeeId: {
      description: "The Billbee ID of the product to update",
      optional: true,
      propDefinition: [
        app,
        "product",
      ],
    },
    reason: {
      type: "string",
      label: "Reason",
      description: "Reason for the stock update",
      optional: true,
    },
    oldQuantity: {
      type: "string",
      label: "Old Quantity",
      description: "The old stock quantity to set",
      optional: true,
    },
    newQuantity: {
      type: "string",
      label: "New Quantity",
      description: "The new stock quantity to set",
      optional: true,
    },
    forceSendStockToShops: {
      type: "boolean",
      label: "Force Send Stock To Shops",
      description: "If true, every sent stockchange is stored and transmitted to the connected shop, even if the value has not changed",
      optional: true,
    },
    autosubtractReservedAmount: {
      type: "boolean",
      label: "Autosubtract Reserved Amount",
      description: "Automatically reduce the NewQuantity by the currently not fulfilled amount",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      stockId,
      billbeeId,
      sku,
      reason,
      oldQuantity,
      newQuantity,
      forceSendStockToShops,
      autosubtractReservedAmount,
    } = this;

    const response = await app.updateStock({
      $,
      data: {
        StockId: stockId,
        BillbeeId: billbeeId,
        Sku: sku,
        Reason: reason,
        OldQuantity: oldQuantity,
        NewQuantity: newQuantity,
        ForceSendStockToShops: forceSendStockToShops,
        AutosubtractReservedAmount: autosubtractReservedAmount,
      },
    });

    $.export("$summary", "Successfully updated stock");

    return response;
  },
};
