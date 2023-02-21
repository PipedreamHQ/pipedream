import shopify from "../../shopify.app.mjs";
import common from "../common/metafield-actions.mjs";

export default {
  ...common,
  key: "shopify-update-product-variant",
  name: "Update Product Variant",
  description: "Update an existing product variant. [See the docs](https://shopify.dev/api/admin-rest/2022-01/resources/product-variant#[put]/admin/api/2022-01/variants/{variant_id}.json)",
  version: "0.0.7",
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
      type: "string[]",
      label: "Metafields",
      description: "An array of objects, each one representing a metafield. If adding a new metafield, the object should contain `key`, `value`, `type`, and `namespace`. Example: `{ \"key\": \"new\", \"value\": \"newvalue\", \"type\": \"single_line_text_field\", \"namespace\": \"global\" }`. To update an existing metafield, use the `id` and `value`. Example: `{ \"id\": \"28408051400984\", \"value\": \"updatedvalue\" }`",
      optional: true,
    },
  },
  async run({ $ }) {
    const metafields = await this.createMetafieldsArray(this.metafields, this.productVariantId, "variants");

    const productVariant = {
      option1: this.option,
      price: this.price,
      image_id: this.imageId,
      metafields,
    };
    const response = (await this.shopify.updateProductVariant(
      this.productVariantId,
      productVariant,
    )).result;
    $.export("$summary", `Updated product variant \`${response.title}\` with id \`${response.id}\``);
    return response;
  },
};
