import base from "../common/base.mjs";
import eventTypes from "../common/event-types.mjs";

export default {
  ...base,
  key: "gorgias-ticket-messaged-created",
  name: "New Ticket Message",
  description: "Emit new event when a ticket message is created. [See the docs](https://developers.gorgias.com/reference/the-event-object)",
  version: "0.0.2",
  type: "source",
  methods: {
    ...base.methods,
    getEventType() {
      return eventTypes.TICKET_MESSAGE_CREATED;
    },
    async processHistoricalEvent(event) {
      const ticketMessage = await this.retrieveTicketMessage(event.object_id);
      this.emitEvent(ticketMessage);
    },
    async processEvent(event) {
      this.emitEvent(event.message);
    },
  },
};
