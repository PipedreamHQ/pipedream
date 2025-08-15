import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "kustomer-updated-customer-instant",
  name: "Updated Customer (Instant)",
  description: "Emit new event when an existing customer's details are updated in Kustomer.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return [
        "kustomer.customer.update",
      ];
    },
    getSummary(body) {
      return `Customer Updated: ${body.data.attributes.name}`;
    },
  },
  sampleEmit,
};
