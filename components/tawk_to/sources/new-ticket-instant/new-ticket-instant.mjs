import common from "../common/base.mjs";

export default {
  ...common,
  key: "tawk_to-new-ticket-instant",
  name: "New Ticket (Instant)",
  description: "Emit new event when a new ticket is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "ticket:create",
      ];
    },
    generateMeta(event) {
      return {
        id: event.ticket.id,
        summary: `New ticket ${event.ticket.id}`,
        ts: Date.parse(event.time),
      };
    },
  },
};
