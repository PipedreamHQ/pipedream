import jumpseller from "../../jumpseller.app.mjs";

export default {
  key: "jumpseller-create-product",
  name: "Create Product",
  description: "Create a new product in Jumpseller. [See the documentation](https://jumpseller.com/support/api/#tag/Products/paths/~1products.json/post)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    jumpseller,
    name: {
      propDefinition: [
        jumpseller,
        "name",
      ],
    },
    price: {
      propDefinition: [
        jumpseller,
        "price",
      ],
    },
    description: {
      propDefinition: [
        jumpseller,
        "description",
      ],
    },
    stock: {
      propDefinition: [
        jumpseller,
        "stock",
      ],
    },
    sku: {
      propDefinition: [
        jumpseller,
        "sku",
      ],
    },
    status: {
      propDefinition: [
        jumpseller,
        "status",
      ],
    },
  },
  async run({ $ }) {
    const { product } = await this.jumpseller.createProduct({
      data: {
        product: {
          name: this.name,
          price: +this.price,
          description: this.description,
          stock: this.stock,
          sku: this.sku,
          status: this.status,
        },
      },
      $,
    });

    if (product?.id) {
      $.export("$summary", `Successfully created product with ID ${product.id}.`);
    }

    return product;
  },
};
