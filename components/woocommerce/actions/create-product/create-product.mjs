import woocommerce from "../../woocommerce.app.mjs";

export default {
  key: "woocommerce-create-product",
  name: "Create Product",
  description: "Creates a new product. [See the docs](https://woocommerce.github.io/woocommerce-rest-api-docs/#create-a-product)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    woocommerce,
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
    const res = await this.woocommerce.createProduct(data);
    $.export("$summary", `Successfully created product ID: ${res.id}`);
    return res;
  },
};
