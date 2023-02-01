import shopify from "../../shopify.app.mjs";

export default {
  key: "shopify-update-product",
  name: "Update Product",
  description: "Update an existing product. [See the docs](https://shopify.dev/api/admin-rest/2022-01/resources/product#[put]/admin/api/2022-01/products/{product_id}.json)",
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
    title: {
      propDefinition: [
        shopify,
        "title",
      ],
      optional: true,
    },
    productDescription: {
      propDefinition: [
        shopify,
        "productDescription",
      ],
    },
    vendor: {
      propDefinition: [
        shopify,
        "vendor",
      ],
    },
    productType: {
      propDefinition: [
        shopify,
        "productType",
      ],
    },
    status: {
      propDefinition: [
        shopify,
        "status",
      ],
    },
    images: {
      propDefinition: [
        shopify,
        "images",
      ],
    },
    options: {
      propDefinition: [
        shopify,
        "options",
      ],
    },
    variants: {
      propDefinition: [
        shopify,
        "variants",
      ],
    },
    tags: {
      propDefinition: [
        shopify,
        "tags",
      ],
    },
  },
  async run({ $ }) {
    let product = {
      title: this.title,
      body_html: this.productDescription,
      vendor: this.vendor,
      product_type: this.productType,
      status: this.status,
      images: this.shopify.parseImages(this.images),
      options: this.shopify.parseArrayOfJSONStrings(this.options),
      variants: this.shopify.parseArrayOfJSONStrings(this.variants),
      tags: this.shopify.parseCommaSeparatedStrings(this.tags),
    };
    let response = (await this.shopify.updateProduct(this.productId, product)).result;
    $.export("$summary", `Updated product \`${response.title}\` with id \`${response.id}\``);
    return response;
  },
};
