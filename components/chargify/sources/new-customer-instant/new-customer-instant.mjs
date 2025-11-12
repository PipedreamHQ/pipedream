import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "chargify-new-customer-instant",
  name: "New Customer (Instant)",
  description: "Emit new event when a new customer is added in Chargify",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return "customer_create";
    },
    getSummary(item) {
      return `New Customer with ID: ${item["payload[customer][id]"]}`;
    },
  },
  sampleEmit,
};
