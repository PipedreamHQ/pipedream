import shopify from "../../shopify.app.mjs";

export default {
  key: "shopify-search-product-variant",
  name: "Search Product Variant",
  description: "Search for product variants or create one if not found. [See the docs](https://shopify.dev/api/admin-rest/2022-01/resources/product-variant#top)",
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
      description: "ID of the product variant. Takes precedence over **Title**",
      optional: true,
    },
    title: {
      propDefinition: [
        shopify,
        "title",
      ],
      description: `${shopify.propDefinitions.title.description}. Creates the product variant with this **Title** and the fields below if not found`,
      optional: true,
    },
    price: {
      propDefinition: [
        shopify,
        "price",
      ],
    },
    imageId: {
      propDefinition: [
        shopify,
        "imageId",
      ],
    },
  },
  async run({ $ }) {
    if (!(this.productVariantId || this.title)) {
      throw new Error("Required field missing: Fill in `Product Variant ID` or `Title`");
    }

    try {
      let response;
      if (this.productVariantId) {
        response = await this.shopify.getProductVariant(this.productVariantId);
      } else {
        response = await this.shopify.getProductVariantByTitle(this.productId, this.title);
      }

      $.export("$summary", `Found product variant \`${response.title}\` with id \`${response.id}\``);
      return response;
    } catch (err) {
      let productVariant = {
        option1: this.title,
        price: this.price,
        image_id: this.imageId,
      };
      // TODO: make this a required additionalProp
      let response = await this.shopify.createProductVariant(this.productId, productVariant);
      $.export("$summary", `Created new product variant \`${response.title}\` with id \`${response.id}\``);
      return response;
    }
  },
};
