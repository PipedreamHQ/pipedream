import common from "../common/base-webhook.mjs";

export default {
  ...common,
  key: "surecart-product-created",
  name: "New Product Created (Instant)",
  description: "Emit new event when a product is created. [See the documentation](https://developer.surecart.com/api-reference/webhook-endpoints/create)",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "product.created",
      ];
    },
  },
};
