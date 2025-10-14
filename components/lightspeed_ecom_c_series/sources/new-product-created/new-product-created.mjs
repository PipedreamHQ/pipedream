import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "indiefunnels-new-product-created",
  name: "New Product Created (Instant)",
  description: "Emit new event when a product is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getItemGroup() {
      return "products";
    },
    getItemAction() {
      return "created";
    },
    generateMeta(body) {
      return {
        id: body.product.id,
        summary: `Product with ID ${body.product.id} created`,
        ts: Date.parse(body.product.createdAt),
      };
    },
  },
  sampleEmit,
};
