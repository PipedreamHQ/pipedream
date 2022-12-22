import shopify from "../../shopify.app.mjs";

export default {
  key: "shopify-create-product-variant",
  name: "Create Product Variant",
  description: "Create a new product variant. [See the docs](https://shopify.dev/api/admin-rest/2022-01/resources/product-variant#[post]/admin/api/2022-01/products/{product_id}/variants.json)",
  version: "0.0.4",
  type: "action",
  props: {
    shopify,
    productId: {
      propDefinition: [
        shopify,
        "productId",
      ],
    },
    option: {
      propDefinition: [
        shopify,
        "option",
      ],
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
        (c) => ({
          productId: c.productId,
        }),
      ],
    },
  },
  async run({ $ }) {
    let productVariant = {
      option1: this.option,
      price: this.price,
      image_id: this.imageId,
    };
    let response = (await this.shopify.createProductVariant(
      this.productId,
      productVariant,
    )).result;
    $.export("$summary", `Created new product variant \`${response.title}\` with id \`${response.id}\``);
    return response;
  },
};
