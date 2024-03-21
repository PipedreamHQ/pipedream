import loyverse from "../../loyverse.app.mjs";

export default {
  key: "loyverse-update-inventory-levels",
  name: "Update Inventory Levels",
  description: "Batch updates the inventory levels for specific item variants.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    loyverse,
    variantQuantities: {
      type: "object[]",
      label: "Variant Quantities",
      description: "List of variant ids and corresponding quantity information.",
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
