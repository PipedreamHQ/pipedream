import common from "../common/base-webhook.mjs";

export default {
  ...common,
  key: "surecart-product-stock-adjusted",
  name: "Product Stock Adjusted (Instant)",
  description: "Emit new event when a product's stock is adjusted. [See the documentation](https://developer.surecart.com/api-reference/webhook-endpoints/create)",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "product.stock_adjusted",
      ];
    },
  },
};
