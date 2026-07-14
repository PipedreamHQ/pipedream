import common from "../common/base-webhook.mjs";

export default {
  ...common,
  key: "surecart-refund-created",
  name: "New Refund Created (Instant)",
  description: "Emit new event when a refund is created. [See the documentation](https://developer.surecart.com/api-reference/webhook-endpoints/create)",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "refund.created",
      ];
    },
  },
};
