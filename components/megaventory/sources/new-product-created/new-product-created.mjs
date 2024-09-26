import common from "../common/polling.mjs";

export default {
  ...common,
  key: "megaventory-new-product-created",
  name: "New Product Created",
  description: "Emit new event when a new product is created. [See the docs](https://api.megaventory.com/v2017a/documentation/index.html#!/Product/postProductProductGet_post_9).",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceName() {
      return "mvProducts";
    },
    getResourceFn() {
      return this.app.listProducts;
    },
    getCreatedAtFieldName() {
      return "ProductCreationDate";
    },
    generateMeta(resource) {
      const {
        ProductID: id,
        [this.getCreatedAtFieldName()]: createdAt,
      } = resource;
      return {
        id,
        summary: `New Product: ${id}`,
        ts: this.extractTimestamp(createdAt),
      };
    },
  },
};
