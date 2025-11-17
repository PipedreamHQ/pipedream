import common from "../common/common.mjs";

export default {
  key: "trengo-new-internal-note",
  name: "New Internal Note Event (Instant)",
  description: "Emit new event when an internal note is added. [See the documentation](https://developers.trengo.com/docs/webhooks)",
  version: "0.0.6",
  type: "source",
  dedupe: "unique",
  ...common,
  methods: {
    ...common.methods,
    getMeta(event) {
      return {
        id: event?.body?.message_id ?
          parseInt(event?.body?.message_id) :
          Date.now(),
        ts: Date.now(),
        summary: `New ticket label added event: ${event?.body?.message}`,
      };
    },
    getEvent() {
      return  "NOTE";
    },
  },
};
