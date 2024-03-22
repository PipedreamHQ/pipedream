import loyverse from "../../loyverse.app.mjs";

export default {
  key: "loyverse-update-inventory-levels",
  name: "Update Inventory Levels",
  description: "Batch updates the inventory levels for specific item variants. [See the documentation](https://developer.loyverse.com/docs/#tag/Inventory/paths/~1inventory/post)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    loyverse,
    inventoryLevels: {
      type: "object[]",
      label: "Inventory Levels",
      description: "[An array of JSON-stringified objects](https://developer.loyverse.com/docs/#tag/Inventory/paths/~1inventory/post). You can use the props below to generate each item and copy it into this array.",
    },

  },
  async run({ $ }) {
    const response = await this.loyverse.batchUpdateInventoryLevels({
      variantQuantities: this.variantQuantities,
    });
    $.export("$summary", "Successfully updated inventory levels");
    return response;
  },
};
