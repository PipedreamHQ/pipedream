import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "ikas-new-customer-instant",
  name: "New Customer (Instant)",
  description: "Emit new event when a customer account is created on ikas. **You can only have one webhook of each type at the same time.**",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getScope() {
      return "store/customer/created";
    },
    getSummary(data) {
      return `New customer created with Id: ${data.id}.`;
    },
  },
  sampleEmit,
};
