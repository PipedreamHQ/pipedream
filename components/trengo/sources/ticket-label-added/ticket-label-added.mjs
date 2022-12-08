import common from "../common/common.mjs";

export default {
  key: "trengo-ticket-label-added",
  name: "New Ticket Label Added Event",
  description: "Emit new events when a ticket label added. [See the docs here](https://developers.trengo.com/docs/webhooks)",
  version: "0.0.1",
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
