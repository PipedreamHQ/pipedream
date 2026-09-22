import common from "../common/base-webhook.mjs";

export default {
  ...common,
  key: "surecart-product-deleted",
  name: "Product Deleted (Instant)",
  description: "Emit new event when a product is deleted. [See the documentation](https://developer.surecart.com/api-reference/webhook-endpoints/create)",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "product.deleted",
      ];
    },
  },
};
