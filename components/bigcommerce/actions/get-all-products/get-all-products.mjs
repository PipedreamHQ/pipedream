import bigcommerce from "../../bigcommerce.app.mjs";

export default {
  key: "bigcommerce-get-all-products",
  name: "Get All Products",
  description:
    "Get all your products. [See the docs here](https://developer.bigcommerce.com/api-reference/4101d472a814d-get-all-products)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    bigcommerce,
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
    };

    const products = [];
    const paginator = this.bigcommerce.paginate({
      $,
      fn: this.bigcommerce.getAllProducts,
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
