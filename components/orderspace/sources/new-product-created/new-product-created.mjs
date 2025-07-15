import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "orderspace-new-product-created",
  name: "New Product Created (Instant)",
  description: "Emit new event when a product is created",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "product.created",
      ];
    },
    generateMeta(data) {
      return {
        id: data.product.id,
        summary: `Product ${data.product.id} created`,
        ts: Date.now(),
      };
    },
  },
  sampleEmit,
};
