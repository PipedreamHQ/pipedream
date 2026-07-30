import common from "../common/base-webhook.mjs";

export default {
  ...common,
  key: "surecart-purchase-created",
  name: "New Purchase Created (Instant)",
  description: "Emit new event when a purchase is created. [See the documentation](https://developer.surecart.com/api-reference/webhook-endpoints/create)",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "purchase.created",
      ];
    },
  },
};
