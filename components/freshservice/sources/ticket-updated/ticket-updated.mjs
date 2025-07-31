import common from "../common/base.mjs";

export default {
  ...common,
  name: "Ticket Updated",
  version: "0.0.{{ts}}",
  key: "freshservice-ticket-updated",
  description: "Emit new event for each updated ticket. [See documentation](https://api.freshservice.com/#view_all_ticket)",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.freshdesk.listTickets;
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
      return {
        id: ticket.id,
        summary: `Updated ticket with ID ${ticket.id}`,
        ts: Date.parse(ticket.updated_at),
      };
    },
  },
};
