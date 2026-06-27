import common from "../common/polling.mjs";

export default {
  ...common,
  key: "sage_accounting-new-product-created",
  name: "New Product Created",
  description: "Emit new event when a product is created in Sage Accounting. [See the documentation](https://developer.sage.com/accounting/reference/products-services/#tag/Products/operation/getProducts)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    generateMeta(product) {
      const id = this.getItemId(product);
      const summary = this.getItemSummary(product);
      return {
        id,
        summary: `New Product: ${summary}`,
        ts: product.created_at
          ? new Date(product.created_at).getTime()
          : Date.now(),
      };
    },
    getItemId(product) {
      return product.id;
    },
    getItemSummary(product) {
      return product.description || product.displayed_as || `Product ${product.id}`;
    },
    async getItems() {
      const products = await this.sageAccounting.listProducts({
        params: {
          items_per_page: 100,
          sort: "created_at:desc",
        },
      });
      return products || [];
    },
  },
};
