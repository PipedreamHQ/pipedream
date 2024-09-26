import common from "../common/polling.mjs";

export default {
  ...common,
  key: "prodpad-new-product-created",
  name: "New Product Created",
  description: "Emit new event when a new product is created. [See the docs](https://app.swaggerhub.com/apis-docs/ProdPad/prodpad/1.0#/Products/GetProducts).",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getRequestResourcesFn() {
      return this.app.listProducts;
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        ts: Date.parse(resource.created_at),
        summary: `New Product ${resource.id}`,
      };
    },
  },
};
