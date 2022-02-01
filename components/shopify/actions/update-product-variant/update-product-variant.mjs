import shopify from "../../shopify.app.mjs";

export default {
  key: "shopify-update-product-variant",
  name: "Update Product Variant",
  description: "Update an existing product variant",
  version: "0.0.1",
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
    productVariant: {
      propDefinition: [
        shopify,
        "variant",
      ],
      description: "Update details for a product variant",
    },
  },
  async run({ $ }) {
    let productVariant = this.shopify._parseJSONStringObjects(this.productVariant);
    let response = await this.shopify.updateProductVariant(
      this.productVariantId,
      productVariant,
    );
    $.export("$summary", `Updated product variant \`${response.title}\` with id \`${response.id}\``);
    return response;
  },
};
