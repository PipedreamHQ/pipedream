import common from "../common/common.mjs";

export default {
  key: "trengo-phone-call-missed",
  name: "New Phone Call Missed Event (Instant)",
  description: "Emit new event when an phone call missed. [See the documentation](https://developers.trengo.com/docs/webhooks)",
  version: "0.0.10",
  type: "source",
  dedupe: "unique",
  ...common,
  methods: {
    ...common.methods,
    getMeta(event) {
      return {
        id: Date.now(),
        ts: Date.now(),
        summary: `New phone call missed event: ${event?.body?.from} => ${event?.body?.to}`,
      };
    },
    getEvent() {
      return  "VOICE_CALL_MISSED";
    },
  },
};
