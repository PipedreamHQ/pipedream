import common from "../common/base.mjs";

export default {
  ...common,
  key: "shoprocket-new-product-instant",
  name: "New Product (Instant)",
  description: "Emit new event when a product is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getSubject() {
      return "product";
    },
  },
};
