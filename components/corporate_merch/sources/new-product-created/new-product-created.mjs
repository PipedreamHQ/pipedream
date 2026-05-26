import common from "../common/base-new-created-resources.mjs";

export default {
  ...common,
  key: "corporate_merch-new-product-created",
  name: "New Product Created",
  description: "Emit new event when a new product is created. [See the documentation](https://corporatemerch.readme.io/reference/list-designs)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.corporateMerch.listProducts;
    },
    getSummary(product) {
      return `New Product with ID: ${product.id}`;
    },
  },
};
