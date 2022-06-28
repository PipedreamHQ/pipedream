import base from "../common/base.mjs";
import eventTypes from "../common/event-types.mjs";

export default {
  ...base,
  key: "gorgias-ticket-created",
  name: "New Ticket",
  description: "Emit new event when a ticket is created. [See the docs](https://developers.gorgias.com/reference/the-event-object)",
  version: "0.0.2",
  type: "source",
  methods: {
    ...base.methods,
    getEventType() {
      return eventTypes.TICKET_CREATED;
    },
    getData() {
      return {
        id: "{{ ticket.id }}",
      };
    },
    async processEvent(event) {
      const ticket = await this.retrieveTicket(event.id);
      this.emitEvent(ticket);
    },
  },
};
