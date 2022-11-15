import shopify from "../../shopify.app.mjs";

export default {
  key: "shopify-create-product",
  name: "Create Product",
  description: "Create a new product. [See the docs](https://shopify.dev/api/admin-rest/2022-01/resources/product#[post]/admin/api/2022-01/products.json)",
  version: "0.0.2",
  type: "action",
  props: {
    shopify,
    title: {
      propDefinition: [
        shopify,
        "title",
      ],
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
    let data = {
      title: this.title,
      body_html: this.productDescription,
      vendor: this.vendor,
      product_type: this.productType,
      status: this.status,
      images: this.shopify.parseImages(this.images),
      variants: this.shopify.parseArrayOfJSONStrings(this.variants),
      options: this.shopify.parseArrayOfJSONStrings(this.options),
      tags: this.shopify.parseCommaSeparatedStrings(this.tags),
    };

    let response = (await this.shopify.createProduct(data)).result;
    $.export("$summary", `Created new product \`${response.title}\` with id \`${response.id}\``);
    return response;
  },
};
