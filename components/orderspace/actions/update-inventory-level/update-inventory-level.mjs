import orderspace from "../../orderspace.app.mjs";

export default {
  key: "orderspace-update-inventory-level",
  name: "Update Inventory Level",
  description: "Update an inventory level. [See the documentation](https://apidocs.orderspace.com/#update-inventory-levels)",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    orderspace,
    productId: {
      propDefinition: [
        orderspace,
        "productId",
      ],
    },
    productSku: {
      propDefinition: [
        orderspace,
        "productSku",
        (c) => ({
          productId: c.productId,
        }),
      ],
    },
    type: {
      type: "string",
      label: "Type",
      description: "The type of inventory level to update",
      options: [
        "on_hand",
        "available",
      ],
    },
    quantity: {
      type: "integer",
      label: "Quantity",
      description: "The quantity of the product to update the inventory level to",
    },
  },
  async run({ $ }) {
    const response = await this.orderspace.updateInventoryLevel({
      $,
      data: {
        inventory_levels: [
          {
            sku: this.productSku,
            [this.type]: this.quantity,
          },
        ],
      },
    });
    $.export("$summary", `Successfully updated inventory level for ${this.productSku}`);
    return response;
  },
};
