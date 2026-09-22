import common from "../common/base-webhook.mjs";

export default {
  ...common,
  key: "surecart-fulfillment-deleted",
  name: "New Fulfillment Deleted (Instant)",
  description: "Emit new event when a fulfillment is deleted. [See the documentation](https://developer.surecart.com/api-reference/webhook-endpoints/create)",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "fulfillment.deleted",
      ];
    },
  },
};
