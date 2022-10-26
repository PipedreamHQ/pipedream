import base from "../common/base.mjs";
import eventTypes from "../common/event-types.mjs";

export default {
  ...base,
  key: "gorgias-ticket-message-created",
  name: "New Ticket Message",
  description: "Emit new event when a ticket message is created. [See the docs](https://developers.gorgias.com/reference/the-event-object)",
  version: "0.1.2",
  type: "source",
  methods: {
    ...base.methods,
    getEventType() {
      return eventTypes.TICKET_MESSAGE_CREATED;
    },
    async processHistoricalEvent(event) {
      // event doesn't contain ticket id to fetch message
      this.emitEvent(event);
    },
    async processEvent(event) {
      this.emitEvent(event.message);
    },
  },
};
