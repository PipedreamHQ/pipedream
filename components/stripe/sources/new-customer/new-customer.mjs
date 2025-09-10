import common from "../common/webhook-base.mjs";

export default {
  ...common,
  key: "stripe-new-customer",
  name: "New Customer",
  type: "source",
  version: "0.1.4",
  description: "Emit new event for each new customer",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "customer.created",
      ];
    },
  },
};
