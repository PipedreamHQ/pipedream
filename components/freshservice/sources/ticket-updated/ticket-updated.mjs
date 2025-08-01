import common from "../common/base.mjs";

export default {
  ...common,
  name: "Ticket Updated",
  version: "0.0.1",
  key: "freshservice-ticket-updated",
  description: "Emit new event for each updated ticket. [See documentation](https://api.freshservice.com/#view_all_ticket)",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.freshservice.listTickets;
    },
    getParams(lastTs) {
      return {
        updated_since: lastTs,
        order_type: "desc",
      };
    },
    getTsField() {
      return "updated_at";
    },
    getResourceKey() {
      return "tickets";
    },
    generateMeta(ticket) {
      const ts = Date.parse(ticket.updated_at);
      return {
        id: `${ticket.id}-${ts}`,
        summary: `Updated ticket with ID ${ticket.id}`,
        ts,
      };
    },
  },
};
