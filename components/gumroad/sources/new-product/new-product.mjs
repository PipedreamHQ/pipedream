import common from "../common/common.mjs";

export default {
  ...common,
  name: "New Product",
  version: "0.0.1",
  key: "gumroad-new-product",
  description: "Emit new event on each new product.",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    emitEvent(data) {
      this.$emit(data, {
        id: data.id,
        summary: `New product with id ${data.id}`,
        ts: new Date(),
      });
    },
    getResources() {
      return this.gumroad.getProducts()
    }
  }
};
