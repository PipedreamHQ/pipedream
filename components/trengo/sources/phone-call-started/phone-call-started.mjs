import common from "../common/common.mjs";

export default {
  key: "trengo-phone-call-started",
  name: "New Phone Call Started Event (Instant)",
  description: "Emit new event when a phone call starts. [See the documentation](https://developers.trengo.com/docs/webhooks)",
  version: "0.0.5",
  type: "source",
  dedupe: "unique",
  ...common,
  methods: {
    ...common.methods,
    getMeta(event) {
      return {
        id: Date.now(),
        ts: Date.now(),
        summary: `New phone call started event: ${event?.body?.from} => ${event?.body?.to}`,
      };
    },
    getEvent() {
      return  "VOICE_CALL_STARTED";
    },
  },
};
