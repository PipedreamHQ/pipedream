import common from "../common/common.mjs";

export default {
  key: "trengo-ticket-label-added",
  name: "New Ticket Label Added Event (Instant)",
  description: "Emit new event when a ticket label is added. [See the documentation](https://developers.trengo.com/docs/webhooks)",
  version: "0.0.6",
  type: "source",
  dedupe: "unique",
  ...common,
  methods: {
    ...common.methods,
    getMeta(event) {
      return {
        id: event?.body?.label_id ?
          parseInt(event?.body?.label_id) :
          Date.now(),
        ts: Date.now(),
        summary: `New ticket label added event: ${event?.body?.label_name}`,
      };
    },
    getEvent() {
      return  "TICKET_LABEL_ADDED";
    },
  },
};
