import helpspace from "../../helpspace.app.mjs";

export default {
  key: "helpspace-new-ticket",
  name: "New Ticket Opened",
  description: "Emits an event when a new ticket is opened in HelpSpace",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    helpspace,
    ticketId: {
      propDefinition: [
        helpspace,
        "ticketId",
      ],
    },
    clientId: {
      propDefinition: [
        helpspace,
        "clientId",
      ],
      optional: true,
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
  },
  methods: {
    _getTicketId() {
      return this.db.get("ticketId");
    },
    _setTicketId(ticketId) {
      this.db.set("ticketId", ticketId);
    },
  },
  async run() {
    const lastTicketId = this._getTicketId();
    const newTicket = await this.helpspace.getNewTicket({
      ticketId: this.ticketId,
      clientId: this.clientId,
    });
    if (newTicket.id !== lastTicketId) {
      this.$emit(newTicket, {
        id: newTicket.id,
        summary: `New ticket opened: ${newTicket.title}`,
        ts: Date.parse(newTicket.created_at),
      });
      this._setTicketId(newTicket.id);
    }
  },
};
