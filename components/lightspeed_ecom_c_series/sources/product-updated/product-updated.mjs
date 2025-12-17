import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "lightspeed_ecom_c_series-product-updated",
  name: "Product Updated (Instant)",
  description: "Emit new event when a product is updated.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getItemGroup() {
      return "products";
    },
    getItemAction() {
      return "updated";
    },
    generateMeta(body) {
      return {
        id: body.product.id,
        summary: `Product with ID ${body.product.id} updated`,
        ts: Date.parse(body.product.updatedAt),
      };
    },
  },
  sampleEmit,
};
