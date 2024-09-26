import { ConfigurationError } from "@pipedream/platform";

export default {
  props: {
    available: {
      type: "string",
      label: "Available Quantity",
      description: "Sets the available inventory quantity",
      optional: true,
    },
    barcode: {
      type: "string",
      label: "Barcode",
      description: "The barcode, UPC, or ISBN number for the product",
      optional: true,
    },
    weight: {
      type: "string",
      label: "Weight",
      description: "The weight of the product variant in the unit system specified with Weight Unit",
      optional: true,
    },
    weightUnit: {
      type: "string",
      label: "Weight Unit",
      description: "The unit of measurement that applies to the product variant's weight. If you don't specify a value for weight_unit, then the shop's default unit of measurement is applied.",
      optional: true,
      options: [
        "g",
        "kg",
        "oz",
        "lb",
      ],
    },
  },
  async run({ $ }) {
    if (this.available && !this.locationId) {
      throw new ConfigurationError("Must enter LocationId to set the available quantity");
    }

    const productVariant = {
      option1: this.option,
      price: this.price,
      image_id: this.imageId,
      sku: this.sku,
      barcode: this.barcode,
      weight: this.weight,
      weight_unit: this.weightUnit,
    };
    let { result } = await this.shopify.createProductVariant(
      this.productId,
      productVariant,
    );

    if (this.available) {
      const { result: inventoryLevel } = await this.shopify.updateInventoryLevel({
        inventory_item_id: result.inventory_item_id,
        location_id: this.locationId,
        available: this.available,
      });
      const { result: updatedProductVariant } = await this.shopify.getProductVariant(result.id);
      result = updatedProductVariant;
      result.inventoryLevel = inventoryLevel;
    }

    $.export("$summary", `Created new product variant \`${result.title}\` with id \`${result.id}\``);
    return result;
  },
};
