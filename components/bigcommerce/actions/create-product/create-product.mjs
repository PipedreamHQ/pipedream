import common from "../common/product.mjs";

export default {
  ...common,
  key: "bigcommerce-create-product",
  name: "Create Product",
  description:
    "Create a product. [See the docs here](https://developer.bigcommerce.com/api-reference/366928572e59e-create-a-product)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  methods: {
    ...common.methods,
    createProduct(args = {}) {
      return this.app._makeRequest({
        method: "POST",
        path: "/catalog/products",
        ...args,
      });
    },
    getRequestFn() {
      return this.createProduct;
    },
    getRequestFnArgs(args = {}) {
      return args;
    },
    getSummary(response) {
      return `Successfully created product with ID \`${response.data.id}\``;
    },
  },
};
