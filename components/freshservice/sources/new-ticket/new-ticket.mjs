import common from "../common/base.mjs";

export default {
  ...common,
  name: "New Ticket",
  version: "0.0.3",
  key: "freshservice-new-ticket",
  description: "Emit new event for each created ticket. [See documentation](https://api.freshservice.com/#view_all_ticket)",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.freshservice.listTickets;
    },
    getParams() {
      return {
        order_type: "desc",
      };
    },
    getResourceKey() {
      return "tickets";
    },
    generateMeta(ticket) {
      return {
        id: ticket.id,
        summary: `New ticket with ID ${ticket.id}`,
        ts: Date.parse(ticket.created_at),
      };
    },
  },
};
