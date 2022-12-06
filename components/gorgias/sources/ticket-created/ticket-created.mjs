import base from "../common/base.mjs";
import eventTypes from "../common/event-types.mjs";

export default {
  ...base,
  key: "gorgias-ticket-created",
  name: "New Ticket",
  description: "Emit new event when a ticket is created. [See the docs](https://developers.gorgias.com/reference/the-event-object)",
  version: "0.1.1",
  type: "source",
  methods: {
    ...base.methods,
    getEventType() {
      return eventTypes.TICKET_CREATED;
    },
    async processHistoricalEvent(event) {
      const ticket = await this.retrieveTicket(event.object_id);
      this.emitEvent(ticket);
    },
    async processEvent(event) {
      this.emitEvent(event.ticket);
    },
  },
};
