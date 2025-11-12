import common from "../common/product.mjs";

const { app } = common.props;

export default {
  ...common,
  key: "bigcommerce-update-product",
  name: "Update Product",
  description:
    "Update a product by Id. [See the docs here](https://developer.bigcommerce.com/api-reference/6f05c1244d972-update-a-product)",
  version: "0.0.5",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    productId: {
      propDefinition: [
        app,
        "productId",
      ],
    },
    ...common.props,
  },
  methods: {
    ...common.methods,
    updateProduct({
      productId, ...args
    }) {
      return this.app._makeRequest({
        method: "PUT",
        path: `/catalog/products/${productId}`,
        ...args,
      });
    },
    getRequestFn() {
      return this.updateProduct;
    },
    getRequestFnArgs(args = {}) {
      return {
        ...args,
        productId: this.productId,
      };
    },
    getSummary(response) {
      return `Successfully updated product with ID \`${response.data.id}\``;
    },
  },
};
