import { defineSource } from "@pipedream/types";
import common from "../common/base";

export default defineSource({
  ...common,
  key: "mailbluster-new-product-created",
  name: "New Product Created",
  description: "Emit new event when a new product is created.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunc() {
      return this.mailbluster.listProducts;
    },
    getField() {
      return "products";
    },
    validateKeys(key1: string|number, key2: string|number) {
      return (key1 > key2);
    },
    getParams() {
      return {
        orderBy: "createdAt",
        orderDir: "desc",
      };
    },
  },
});
