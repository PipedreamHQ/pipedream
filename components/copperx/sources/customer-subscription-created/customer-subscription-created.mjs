import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "copperx-customer-subscription-created",
  name: "New Customer Subscription Created (Instant)",
  description: "Emit new event when a new customer subcription is created.",
  version: "0.0.2",
  type: "source",
  methods: {
    ...common.methods,
    getEvent() {
      return [
        "customer.subscription.created",
      ];
    },
    getSummary(id) {
      return `A new customer subscription with id: ${id} was created!`;
    },
  },
  sampleEmit,
};
