import common from "../common/common.mjs";

export default {
  key: "trengo-phone-call-ended",
  name: "New Phone Call Ended Event (Instant)",
  description: "Emit new event when a phone call ends. [See the documentation](https://developers.trengo.com/docs/webhooks)",
  version: "0.0.7",
  type: "source",
  dedupe: "unique",
  ...common,
  methods: {
    ...common.methods,
    getMeta(event) {
      return {
        id: Date.now(),
        ts: Date.now(),
        summary: `New phone call ended event: ${event?.body?.from} => ${event?.body?.to}`,
      };
    },
    getEvent() {
      return  "VOICE_CALL_ENDED";
    },
  },
};
