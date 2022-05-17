import base from "../common/base.mjs";
import eventTypes from "../common/event-types.mjs";

export default {
  ...base,
  key: "gorgias-ticket-messaged-created",
  name: "New Ticket Message",
  description: "Emit new event when a ticket message is created. [See the docs](https://developers.gorgias.com/reference/the-event-object)",
  version: "0.0.1",
  type: "source",
  methods: {
    ...base.methods,
    getEventTypes() {
      return {
        types: eventTypes.TICKET_MESSAGE_CREATED,
      };
    },
  },
};
