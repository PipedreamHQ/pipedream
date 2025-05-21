import ninjaone from "../../ninjaone.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "ninjaone-new-ticket-instant",
  name: "New Ticket Instant",
  description: "Emit new event when a new support ticket is created in NinjaOne. [See the documentation](https://app.ninjarmm.com/apidocs/?links.active=core)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    ninjaone,
    http: {
      type: "$.interface.http",
      customResponse: false,
    },
    db: "$.service.db",
    ticketPriority: {
      propDefinition: [
        ninjaone,
        "ticketPriority",
      ],
      optional: true,
    },
    ticketStatus: {
      propDefinition: [
        ninjaone,
        "ticketStatus",
      ],
      optional: true,
    },
  },
  methods: {
    _getLastProcessedTimestamp() {
      return this.db.get("lastProcessedTimestamp") || 0;
    },
    _setLastProcessedTimestamp(timestamp) {
      this.db.set("lastProcessedTimestamp", timestamp);
    },
  },
  hooks: {
    async deploy() {
      const lastProcessedTimestamp = this._getLastProcessedTimestamp();
      const tickets = await this.ninjaone.emitNewSupportTicket({
        ticketPriority: this.ticketPriority,
        ticketStatus: this.ticketStatus,
      });

      tickets.slice(-50).forEach((ticket) => {
        if (new Date(ticket.created_at).getTime() > lastProcessedTimestamp) {
          this.$emit(ticket, {
            id: ticket.id,
            summary: `New ticket: ${ticket.title}`,
            ts: Date.parse(ticket.last_modified),
          });
        }
      });

      if (tickets.length > 0) {
        const latestTimestamp = Math.max(...tickets.map((ticket) => Date.parse(ticket.last_modified)));
        this._setLastProcessedTimestamp(latestTimestamp);
      }
    },
    async activate() {
      // Implement webhook creation logic if supported by the API
    },
    async deactivate() {
      // Implement webhook deletion logic if supported by the API
    },
  },
  async run(event) {
    const { body } = event;
    this.$emit(body, {
      id: body.id,
      summary: `New ticket: ${body.title}`,
      ts: Date.parse(body.last_modified),
    });
  },
};
