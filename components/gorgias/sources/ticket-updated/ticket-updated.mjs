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
    getEventTypes() {
      return {
        types: eventTypes.TICKET_UPDATED,
      };
    },
  },
};
