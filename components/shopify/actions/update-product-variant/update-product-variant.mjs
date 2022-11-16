import shopify from "../../shopify.app.mjs";

export default {
  key: "shopify-update-product-variant",
  name: "Update Product Variant",
  description: "Update an existing product variant. [See the docs](https://shopify.dev/api/admin-rest/2022-01/resources/product-variant#[put]/admin/api/2022-01/variants/{variant_id}.json)",
  version: "0.0.3",
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
  },
  async run({ $ }) {
    let productVariant = {
      option1: this.option,
      price: this.price,
      image_id: this.imageId,
    };
    let response = (await this.shopify.updateProductVariant(
      this.productVariantId,
      productVariant,
    )).result;
    $.export("$summary", `Updated product variant \`${response.title}\` with id \`${response.id}\``);
    return response;
  },
};
