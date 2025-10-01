import woocommerce from "../../woocommerce.app.mjs";

export default {
  key: "woocommerce-update-product",
  name: "Update Product",
  description: "Updates a product. [See the docs](https://woocommerce.github.io/woocommerce-rest-api-docs/#update-a-product)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    woocommerce,
    productId: {
      type: "string",
      propDefinition: [
        woocommerce,
        "products",
      ],
    },
    name: {
      propDefinition: [
        woocommerce,
        "productName",
      ],
    },
    type: {
      propDefinition: [
        woocommerce,
        "productType",
      ],
    },
    status: {
      propDefinition: [
        woocommerce,
        "productStatus",
      ],
    },
    regularPrice: {
      propDefinition: [
        woocommerce,
        "regularPrice",
      ],
    },
    salePrice: {
      propDefinition: [
        woocommerce,
        "salePrice",
      ],
    },
    description: {
      propDefinition: [
        woocommerce,
        "productDescription",
      ],
    },
    categories: {
      propDefinition: [
        woocommerce,
        "productCategories",
      ],
    },
    image: {
      propDefinition: [
        woocommerce,
        "productImage",
      ],
    },
  },
  async run({ $ }) {
    const categories = this.categories
      ? this.categories.map((category) => ({
        id: category,
      }))
      : undefined;
    const images = this.image
      ? [
        {
          src: this.image,
        },
      ]
      : undefined;
    const data = {
      name: this.name,
      type: this.type,
      status: this.status,
      regular_price: this.regularPrice,
      sale_price: this.salePrice,
      description: this.description,
      categories,
      images,
    };

    const res = await this.woocommerce.updateProduct(this.productId.value, data);

    $.export("$summary", `Successfully updated product ID: ${res.id}`);

    return res;
  },
};
