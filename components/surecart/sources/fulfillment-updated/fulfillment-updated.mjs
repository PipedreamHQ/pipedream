import common from "../common/base-webhook.mjs";

export default {
  ...common,
  key: "surecart-fulfillment-updated",
  name: "New Fulfillment Updated (Instant)",
  description: "Emit new event when a fulfillment is updated. [See the documentation](https://developer.surecart.com/api-reference/webhook-endpoints/create)",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "fulfillment.updated",
      ];
    },
  },
};
