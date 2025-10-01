import jumpseller from "../../jumpseller.app.mjs";
import lodash from "lodash";

export default {
  key: "jumpseller-update-product",
  name: "Update Product",
  description: "Update an existing product in Jumpseller. [See the documentation](https://jumpseller.com/support/api/#tag/Products/paths/~1products~1%7Bid%7D.json/put)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
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
    name: {
      propDefinition: [
        jumpseller,
        "name",
      ],
      optional: true,
    },
    price: {
      propDefinition: [
        jumpseller,
        "price",
      ],
      optional: true,
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
    const { product } = await this.jumpseller.updateProduct({
      productId: this.productId,
      data: {
        product: lodash.pickBy({
          name: this.name,
          price: +this.price,
          description: this.description,
          stock: this.stock,
          sku: this.sku,
          status: this.status,
        }),
      },
      $,
    });

    if (product?.id) {
      $.export("$summary", `Successfully updated product with ID ${product.id}.`);
    }

    return product;
  },
};
