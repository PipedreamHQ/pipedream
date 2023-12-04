import common from "../common/base.mjs";

export default {
  ...common,
  key: "shoprocket-new-customer-instant",
  name: "New Customer (Instant)",
  description: "Emit new event when a customer is created. [See the documentation](https://api.shoprocket.io/docs)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getSubject() {
      return "customer";
    },
  },
};
