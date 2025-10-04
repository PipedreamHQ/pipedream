import sellercloud from "../../sellercloud.app.mjs";

export default {
  key: "sellercloud-adjust-inventory",
  name: "Adjust Inventory",
  description: "Changes the inventory level of a specific product. [See the documentation](https://developer.sellercloud.com/dev-article/adjust-physical-inventory/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    sellercloud,
    warehouse: {
      propDefinition: [
        sellercloud,
        "warehouse",
      ],
    },
    view: {
      propDefinition: [
        sellercloud,
        "view",
      ],
    },
    product: {
      propDefinition: [
        sellercloud,
        "product",
        (c) => ({
          warehouse: c.warehouse.label,
          viewID: c.view,
        }),
      ],
    },
    quantity: {
      type: "integer",
      label: "Quantity",
      description: "The quantity to adjust",
    },
    adjustmentType: {
      propDefinition: [
        sellercloud,
        "adjustmentType",
      ],
    },
    reason: {
      type: "string",
      label: "Reason",
      description: "The reason for doing the adjustment",
    },
    pinCode: {
      type: "string",
      label: "Pin Code",
      description: "Pin Code for verification",
      optional: true,
    },
    inventoryCost: {
      type: "string",
      label: "Inventory Cost",
      description: "The inventory cost",
      optional: true,
    },
    siteCost: {
      type: "string",
      label: "Site Cost",
      description: "The site cost",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      WarehouseID: this.warehouse.value,
      ProductID: this.product,
      Qty: this.quantity,
      AdjustmentType: this.adjustmentType,
      Reason: this.reason,
      PinCode: this.pinCode,
      InventoryCost: this.inventoryCost,
      SiteCost: this.siteCost,
    };

    await this.sellercloud.adjustInventory({
      data,
      $,
    });

    $.export("$summary", `Successfully updated inventory of product with ID ${this.product}`);

    // nothing to return
  },
};
