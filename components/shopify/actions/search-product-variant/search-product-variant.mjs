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
      optional: true,
    },
    productVariant: {
      propDefinition: [
        shopify,
        "variant",
      ],
      optional: true,
      description: `${shopify.propDefinitions.variant.description}. Creates the variant when the fields below are filled and the **Product Variant Title** is not found`,
    },
  },
  async run({ $ }) {
    try {
      if (!(this.productVariantId || this.title)) {
        throw new Error("Required field `Product Variant ID`, `Title` or `Variant` is missing");
      }

      let response;
      if (this.productVariantId) {
        response = await this.shopify.getProductVariant(this.productVariantId);
      } else {
        response = await this.shopify.getProductVariantByTitle(this.productId, this.title);
      }

      $.export("$summary", `Found product variant \`${response.title}\` with id \`${response.id}\``);
      return response;
    } catch (err) {
      let productVariant = this.shopify.parseJSONStringObjects(this.productVariant);
      if (Object.values(productVariant).length > 0) {
        // TODO: make this a required additionalProp
        let response = await this.shopify.createProductVariant(this.productId, productVariant);
        $.export("$summary", `Created new product variant \`${response.title}\` with id \`${response.id}\``);
        return response;
      }

      throw err;
    }
  },
};
