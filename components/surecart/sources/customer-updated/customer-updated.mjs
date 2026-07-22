import common from "../common/base-webhook.mjs";

export default {
  ...common,
  key: "surecart-customer-updated",
  name: "Customer Updated (Instant)",
  description: "Emit new event when a customer is updated. [See the documentation](https://developer.surecart.com/api-reference/webhook-endpoints/create)",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "customer.updated",
      ];
    },
  },
};
