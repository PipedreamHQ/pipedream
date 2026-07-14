import common from "../common/base-webhook.mjs";

export default {
  ...common,
  key: "surecart-customer-created",
  name: "New Customer Created (Instant)",
  description: "Emit new event when a new customer is created. [See the documentation](https://developer.surecart.com/api-reference/webhook-endpoints/create)",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "customer.created",
      ];
    },
  },
};
