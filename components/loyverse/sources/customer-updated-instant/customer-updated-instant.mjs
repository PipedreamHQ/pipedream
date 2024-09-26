import common from "../common/common.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "loyverse-customer-updated-instant",
  name: "Customer Updated (Instant)",
  description: "Emit new event when a customer is updated.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  sampleEmit,
  methods: {
    ...common.methods,
    getSummary(body) {
      const { length } = body.customers;
      return `${length} customer${length === 1
        ? ""
        : "s"} updated`;
    },
    getHookType() {
      return "customers.update";
    },
  },
};
