import common from "../common/base-webhook.mjs";

export default {
  ...common,
  key: "surecart-price-created",
  name: "New Price Created (Instant)",
  description: "Emit new event when a price is created. [See the documentation](https://developer.surecart.com/api-reference/webhook-endpoints/create)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "price.created",
      ];
    },
  },
};
