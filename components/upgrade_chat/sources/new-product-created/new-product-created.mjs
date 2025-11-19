import common from "../common/base.mjs";

export default {
  ...common,
  key: "upgrade_chat-new-product-created",
  name: "New Product Created",
  description: "Emit new events when a product is created. [See the documentation](https://upgrade.chat/developers/documentation)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.upgradeChat.listProducts;
    },
    getSummary(product) {
      return `Product ${product.name} created`;
    },
  },
};
