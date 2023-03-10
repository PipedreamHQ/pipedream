import shopify from "../../shopify.app.mjs";
import common from "../common/metafield-actions.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  ...common,
  key: "shopify-update-product-variant",
  name: "Update Product Variant",
  description: "Update an existing product variant. [See the docs](https://shopify.dev/api/admin-rest/2022-01/resources/product-variant#[put]/admin/api/2022-01/variants/{variant_id}.json)",
  version: "0.0.10",
  type: "action",
  props: {
    shopify,
    productId: {
      propDefinition: [
        shopify,
        "productId",
      ],
    },
    productVariantId: {
      propDefinition: [
        shopify,
        "productVariantId",
        (c) => c,
      ],
      description: `${shopify.propDefinitions.productVariantId.description}
        Option displayed here as the title of the product variant`,
    },
    option: {
      propDefinition: [
        shopify,
        "option",
      ],
      optional: true,
    },
    price: {
      propDefinition: [
        shopify,
        "price",
      ],
      description: "The price of the product variant",
    },
    imageId: {
      propDefinition: [
        shopify,
        "imageId",
        (c) => c,
      ],
    },
    metafields: {
      propDefinition: [
        shopify,
        "metafields",
      ],
    },
    sku: {
      propDefinition: [
        shopify,
        "sku",
      ],
    },
    countryCodeOfOrigin: {
      propDefinition: [
        shopify,
        "country",
      ],
      description: "The country code [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) of where the item came from",
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
