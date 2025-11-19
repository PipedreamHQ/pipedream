import common from "../common/base.mjs";

export default {
  ...common,
  key: "upgrade_chat-product-updated",
  name: "Product Updated",
  description: "Emit new event when a product is updated. [See the documentation](https://upgrade.chat/developers/documentation)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.upgradeChat.listProducts;
    },
    getSummary(product) {
      return `Product ${product.name} updated`;
    },
    getTsField() {
      return "updated";
    },
  },
};
