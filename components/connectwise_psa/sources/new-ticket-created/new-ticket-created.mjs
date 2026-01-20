import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "connectwise_psa-new-ticket-created",
  name: "New Ticket Created",
  description: "Emit new event when a new ticket is created in Connectwise.",
  version: "0.0.4",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.connectwise.listTickets;
    },
    getSummary(item) {
      return `New Ticket Created: ${item.summary}`;
    },
  },
  sampleEmit,
};
