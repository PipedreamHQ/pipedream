import { ConfigurationError } from "@pipedream/platform";

export default {
  props: {
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
    } = this;

    if (!option && !price && !imageId && !metafieldsArray && !sku) {
      throw new ConfigurationError("Must enter one of `title`, `price`, `imageId`, `metafields`, or `sku`.");
    }

    const metafields = await this.createMetafieldsArray(metafieldsArray, productVariantId, "variants");

    const response = {};
    const { result: productVariant } = await this.shopify.updateProductVariant(productVariantId, {
      option1: option,
      price,
      image_id: imageId,
      metafields,
      sku,
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

    $.export("$summary", `Updated product variant \`${productVariant.title}\` with id \`${productVariant.id}\``);
    return response;
  },
};
