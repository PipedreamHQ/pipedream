import common from "../common/base.mjs";

export default {
  ...common,
  type: "source",
  name: "New Product",
  key: "teamgate-new-product",
  description: "Emit new event when a new product is created. [See docs here](https://developers.teamgate.com/#95a7d362-2789-4608-9ea4-b3c72f1a6406)",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    ...common.props,
  },
  methods: {
    ...common.methods,
    getSummary(name, id) {
      return `New product created: ${name} (${id})`;
    },
    getFunc() {
      return this.teamgate.listProducts;
    },
  },
};
