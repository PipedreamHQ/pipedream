import base from "../common/base.mjs";
import eventTypes from "../common/event-types.mjs";

export default {
  ...base,
  key: "gorgias-ticket-updated",
  name: "New Updated Ticket",
  description: "Emit new event when a ticket is updated. [See the docs](https://developers.gorgias.com/reference/the-event-object)",
  version: "0.0.1",
  type: "source",
  methods: {
    ...base.methods,
    getEventType() {
      return eventTypes.TICKET_UPDATED;
    },
    getData() {
      return {
        id: "{{ ticket.id }}",
      };
    },
  },
  async run(event) {
    console.log("Raw received event:");
    console.log(event);
    const ticket = await this.retrieveTicket(event.query.id);
    this.emitEvent(ticket);
  },
};
