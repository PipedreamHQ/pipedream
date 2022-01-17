import shopify from "../../shopify.app.js";

export default {
  key: "shopify-search-product-variant",
  name: "Search Product Variant",
  description: "Search for product variants or create one if not found",
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
      description: `ID of the product variant
        Takes precedence over Title`,
      optional: true,
    },
    title: {
      propDefinition: [
        shopify,
        "title",
      ],
      optional: true,
    },
    fields: {
      propDefinition: [
        shopify,
        "responseFields",
      ],
    },
    variant: {
      propDefinition: [
        shopify,
        "variant",
      ],
      optional: true,
      description: `${shopify.propDefinitions.variant.description}
        Creates the variant when the fields below are filled and the Product Variant Title is not found`,
    },
  },
  async run({ $ }) {
    try {
      if (!(this.productVariantId || this.title)) {
        throw new Error("Required field `Product Variant ID`, `Title` or `Variant` is missing");
      }

      let response;
      let params = {
        fields: this.shopify._parseCommaSeparatedStrings(this.fields),
      };

      if (this.productVariantId) {
        response = await this.shopify.getProductVariant(this.productVariantId, params);
      } else {
        response = await this.shopify.getProductVariantByTitle(this.productId, this.title, params);
      }

      $.export("$summary", `Found product variant \`${response.title}\` with id \`${response.id}\``);
      return response;
    } catch (err) {
      let variant = this.shopify._makeRequestOpts(this.variant);
      if (Object.keys(variant).length > 0) {
        // TODO: make this a required additionalProp
        let response = await this.shopify.createProductVariant(this.productId, variant);
        $.export("$summary", `Created new product variant \`${response.title}\` with id \`${response.id}\``);
        return response;
      }

      throw err;
    }
  },
};
