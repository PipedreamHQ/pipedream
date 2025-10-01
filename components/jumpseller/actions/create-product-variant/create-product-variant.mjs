import jumpseller from "../../jumpseller.app.mjs";

export default {
  key: "jumpseller-create-product-variant",
  name: "Create Product Variant",
  description: "Create a new product variant in Jumpseller. [See the documentation](https://jumpseller.com/support/api/#tag/Product-Variants/paths/~1products~1%7Bid%7D~1variants.json/post)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    jumpseller,
    productId: {
      propDefinition: [
        jumpseller,
        "productId",
      ],
    },
    price: {
      propDefinition: [
        jumpseller,
        "price",
      ],
      description: "The price of the product variant.",
      optional: true,
    },
    sku: {
      propDefinition: [
        jumpseller,
        "sku",
      ],
      description: "The sku of the product variant.",
    },
    stock: {
      propDefinition: [
        jumpseller,
        "stock",
      ],
      description: "Quantity in stock for the product variant.",
    },
    options: {
      type: "object",
      label: "Options",
      description: "Enter the name and value of options as key/value pairs.",
      optional: true,
    },
  },
  async run({ $ }) {
    const options = [];
    if (this.options) {
      for (const [
        key,
        value,
      ] of Object.entries(this.options)) {
        options.push({
          name: key,
          value,
        });
      }
    }

    const { variant } = await this.jumpseller.createProductVariant({
      productId: this.productId,
      data: {
        variant: {
          price: +this.price,
          sku: this.sku,
          stock: this.stock,
          options,
        },
      },
      $,
    });

    if (variant?.id) {
      $.export("$summary", `Successfully created product variant with ID ${variant.id}.`);
    }

    return variant;
  },
};
