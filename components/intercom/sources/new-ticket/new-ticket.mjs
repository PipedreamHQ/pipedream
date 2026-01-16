import common from "../common/common.mjs";

export default {
  ...common,
  key: "intercom-new-ticket",
  name: "New Tickets",
  description: "Emit new event when a new ticket is created in Intercom.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    generateMeta({
      id, ticket_attributes, created_at: createdAt,
    }) {
      return {
        id,
        summary: ticket_attributes?._default_title_ || `New Ticket ${id}`,
        ts: createdAt,
      };
    },
  },
  async run() {
    let lastTicketCreatedAt = this._getLastUpdate();
    const data = {
      query: {
        operator: "AND",
        value: [
          {
            field: "created_at",
            operator: ">",
            value: lastTicketCreatedAt,
          },
        ],
      },
    };

    const results = await this.intercom.searchTickets(data);
    for (const ticket of results) {
      if (ticket.created_at > lastTicketCreatedAt) {
        lastTicketCreatedAt = ticket.created_at;
      }
      const meta = this.generateMeta(ticket);
      this.$emit(ticket, meta);
    }

    this._setLastUpdate(lastTicketCreatedAt);
  },
};
