import common from "../common/common.mjs";

export default {
  key: "trengo-new-outbound-message",
  name: "New Outbound Message Event (Instant)",
  description: "Emit new event when an outbound message sent. [See the documentation](https://developers.trengo.com/docs/webhooks)",
  version: "0.0.9",
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
        summary: `New outbund message event: ${event?.body?.message}`,
      };
    },
    getEvent() {
      return  "OUTBOUND";
    },
  },
};
