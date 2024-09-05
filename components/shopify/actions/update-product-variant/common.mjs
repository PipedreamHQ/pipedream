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
    harmonizedSystemCode: {
      type: "integer",
      label: "Harmonized System Code",
      description: "The general [harmonized system](https://en.wikipedia.org/wiki/Harmonized_System) code for the inventory item",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      productVariantId,
      option,
      price,
      imageId,
      metafields: metafieldsArray,
      sku,
      countryCodeOfOrigin,
      harmonizedSystemCode,
      locationId,
      available,
      barcode,
      weight,
      weightUnit,
    } = this;

    if (available && !locationId) {
      throw new ConfigurationError("Must enter LocationId to set the available quantity");
    }

    if (!option
      && !price
      && !imageId
      && !metafieldsArray
      && !sku
      && !barcode
      && !weight
      && !weightUnit
    ) {
      throw new ConfigurationError("Must enter one of `title`, `price`, `imageId`, `metafields`, `sku`, `barcode`, `weight`, or `weightUnit`.");
    }

    const metafields = await this.createMetafieldsArray(metafieldsArray, productVariantId, "variants");

    const response = {};
    const { result: productVariant } = await this.shopify.updateProductVariant(productVariantId, {
      option1: option,
      price,
      image_id: imageId,
      metafields,
      sku,
      barcode,
      weight,
      weight_unit: weightUnit,
    });
    response.productVariant = productVariant;

    if (countryCodeOfOrigin || harmonizedSystemCode) {
      const { result: inventoryItem } = await this.shopify.updateInventoryItem(
        productVariant.inventory_item_id, {
          country_code_of_origin: countryCodeOfOrigin,
          harmonized_system_code: harmonizedSystemCode,
        },
      );
      response.inventoryItem = inventoryItem;
    }

    if (available) {
      const { result: inventoryLevel } = await this.shopify.updateInventoryLevel({
        inventory_item_id: productVariant.inventory_item_id,
        location_id: locationId,
        available,
      });
      response.inventoryLevel = inventoryLevel;
      const { result: updatedVariant } = await this.shopify.getProductVariant(productVariantId);
      response.productVariant = updatedVariant;
    }

    $.export("$summary", `Updated product variant \`${productVariant.title}\` with id \`${productVariant.id}\``);
    return response;
  },
};
