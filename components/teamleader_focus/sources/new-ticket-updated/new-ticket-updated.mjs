import common from "../common/common.mjs";

export default {
  ...common,
  key: "teamleader_focus-new-ticket-updated",
  name: "New Ticket Updated (Instant)",
  description: "Emit new event for each ticket updated. [See the documentation](https://developer.focus.teamleader.eu/docs/api/webhooks-register)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async getHistoricalEvents() {
      const { data } = await this.teamleaderFocus.listTickets({
        data: {
          sort: [
            {
              field: "created_at",
              order: "desc",
            },
          ],
        },
      });
      return data || [];
    },
    getEventTypes() {
      return [
        "ticket.updated",
      ];
    },
    async getResource(body) {
      const ticketId = body.subject.id;
      const { data } = await this.teamleaderFocus.getTicket({
        data: {
          id: ticketId,
        },
      });
      return data;
    },
    generateMeta(ticket) {
      const ts = Date.now();
      return {
        id: `${ticket.id}-${ts}`,
        summary: `Ticket Updated: ${ticket.subject}`,
        ts,
      };
    },
  },
};
