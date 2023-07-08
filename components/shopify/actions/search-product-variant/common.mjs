export default {
  props: {
    createIfNotFound: {
      type: "boolean",
      label: "Create If Not Found",
      description: "Creates the product variant with **Title** and the fields below if not found",
      optional: true,
      default: false,
      reloadProps: true,
    },
  },
  async additionalProps() {
    let props = {};
    if (this.createIfNotFound) {
      props.price = {
        type: "string",
        label: "Price",
        description: "The price of the product variant",
        optional: true,
      };
      props.imageId = {
        type: "string",
        label: "Image ID",
        description: "The unique numeric identifier for a product's image. The image must be associated to the same product as the variant",
        optional: true,
      };
    }
    return props;
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

      $.export("$summary", `Found product variant \`${response.result.title}\` with id \`${response.result.id}\``);
      return response;
    } catch (err) {
      if (!this.createIfNotFound) {
        throw err;
      }

      let productVariant = {
        option1: this.title,
        price: this.price,
        image_id: this.imageId,
      };
      let response = (await this.shopify.createProductVariant(
        this.productId,
        productVariant,
      )).result;
      $.export("$summary", `Created new product variant \`${response.title}\` with id \`${response.id}\``);
      return response;
    }
  },
};
