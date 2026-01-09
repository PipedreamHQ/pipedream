import common from "../common/base-polling-no-pagination.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "simplero-new-product",
  name: "New Product",
  description: "Emit new event when a new product is created. [See the documentation](https://github.com/Simplero/Simplero-API?tab=readme-ov-file#get-products)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunction() {
      return this.simplero.getProducts;
    },
    getSummary(item) {
      return `New Product: ${item.name}`;
    },
  },
  sampleEmit,
};

