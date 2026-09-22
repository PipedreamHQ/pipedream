import common from "../common/base-webhook.mjs";

export default {
  ...common,
  key: "surecart-price-updated",
  name: "New Price Updated (Instant)",
  description: "Emit new event when a price is updated. [See the documentation](https://developer.surecart.com/api-reference/webhook-endpoints/create)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "price.updated",
      ];
    },
  },
};
