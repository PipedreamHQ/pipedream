import common from "../common/source.mjs";

export default {
  ...common,
  key: "repairshopr-new-ticket",
  type: "source",
  name: "New Ticket",
  description: "Emit new event when a new ticket is created.",
  version: "0.0.1",
  methods: {
    ...common.methods,
    getData() {
      return this.app.listTickets;
    },
    getAgregatorProp() {
      return "tickets";
    },
    getParams() {
      return {
        created_after: this.getLastEmittedDate(),
      };
    },
    getSummary(event) {
      return {
        id: event.id,
        summary: event.subject || event.id,
        ts: event.created_at || Date.now(),
      };
    },
  },
};
