import common from "../common/common.mjs";

export default {
  key: "trengo-ticket-closed",
  name: "Ticket Closed (Instant)",
  description: "Emit new event when a ticket is closed. [See the documentation](https://developers.trengo.com/docs/webhooks)",
  version: "0.0.5",
  type: "source",
  dedupe: "unique",
  ...common,
  methods: {
    ...common.methods,
    getMeta(event) {
      const ts = Date.now();
      const id = event?.body?.ticket_id ?
        parseInt(event.body.ticket_id) :
        ts;
      const summary = `Ticket closed: #${id} (Status: ${event?.body?.status})`;
      return {
        id,
        ts,
        summary,
      };
    },
    getEvent() {
      return "TICKET_CLOSED";
    },
  },
};
