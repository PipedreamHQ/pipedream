import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "kustomer-new-customer-instant",
  name: "New Customer Created (Instant)",
  description: "Emit new event when a new customer is added to Kustomer.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return [
        "kustomer.customer.create",
      ];
    },
    getSummary(body) {
      return `New Customer: ${body.data.attributes.name}`;
    },
  },
  sampleEmit,
};
