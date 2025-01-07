import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "pennylane-new-customer",
  name: "New Customer Created",
  description: "Emit new event when a customer is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunction() {
      return this.pennylane.listCustomers;
    },
    getFieldName() {
      return "customers";
    },
    getSummary(item) {
      return `New Customer: ${item.name}`;
    },
  },
  sampleEmit,
};
