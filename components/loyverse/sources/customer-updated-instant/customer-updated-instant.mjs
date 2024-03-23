import common from "../common/common.mjs";

export default {
  ...common,
  key: "loyverse-customer-updated-instant",
  name: "Customer Updated (Instant)",
  description: "Emit new event when a customer is updated. [See the documentation]",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getHookType() {
      return "customers.update";
    },
  },
};
