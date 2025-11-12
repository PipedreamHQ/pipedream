import bigcommerce from "../../bigcommerce.app.mjs";

export default {
  key: "bigcommerce-get-all-products-sort-order",
  name: "Get All Products Sort Order",
  description:
    "Get all your products. [See the docs here](https://developer.bigcommerce.com/api-reference/90ab7265480e2-get-product-sort-order)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    bigcommerce,
    categoryId: {
      propDefinition: [
        bigcommerce,
        "categoryId",
      ],
    },
    limit: {
      propDefinition: [
        bigcommerce,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    const params = {
      limit: this.limit,
      categoryId: this.categoryId,
    };

    const products = [];
    const paginator = this.bigcommerce.paginate({
      $,
      fn: this.bigcommerce.getAllProductsSortOrder,
      params,
    });
    for await (const product of paginator) {
      products.push(product);
    }

    const suffix = products.length === 1
      ? ""
      : "s";

    $.export("$summary", `Returned ${products.length} product${suffix}`);
    return products;
  },
};
