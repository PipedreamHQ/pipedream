import common from "../common/common.mjs";

export default {
  key: "trengo-phone-call-ended",
  name: "New Phone Call Ended Event",
  description: "Emit new events when an phone call ended. [See the docs here](https://developers.trengo.com/docs/webhooks)",
  version: "0.0.1",
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
