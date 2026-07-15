import common from "../common/base-webhook.mjs";

export default {
  ...common,
  key: "surecart-variant-stock-adjusted",
  name: "Variant Stock Adjusted (Instant)",
  description: "Emit new event when a product variant's stock is adjusted. [See the documentation](https://developer.surecart.com/api-reference/webhook-endpoints/create)",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "variant.stock_adjusted",
      ];
    },
  },
};
