import common from "../common/common.mjs";

export default {
  ...common,
  key: "recharge-new-customer-created",
  name: "New Customer Created (Instant)",
  description: "Emit new event when a new customer is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getSummary() {
      return "New Customer";
    },
    getHookData() {
      return {
        topic: "customer/created",
        included_objects: [
          "addresses",
          "metafields",
          // "payment_methods", // listed in documentation, but API returns an error
        ],
      };
    },
  },
};
