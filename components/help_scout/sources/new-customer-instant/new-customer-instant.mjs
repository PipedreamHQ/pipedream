import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "help_scout-new-customer-instant",
  name: "New Customer Added (Instant)",
  description: "Emit new event when a new customer is added.",
  version: "0.0.4",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return [
        "customer.created",
      ];
    },
    getSummary(body) {
      return `New customer created: ${body.firstName} ${body.lastName} - ${body._embedded.emails[0].value}`;
    },
  },
  sampleEmit,
};
