import common from "../common/common.mjs";

export default {
  key: "trengo-voice-call-recorded",
  name: "New Voice Call Recorded Event (Instant)",
  description: "Emit new event when a voice call is recorded. [See the documentation](https://developers.trengo.com/docs/webhooks)",
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
        summary: `Voice call recorded: ${event?.body?.from} => ${event?.body?.to} (${event?.body?.duration}s)`,
      };
    },
    getEvent() {
      return "VOICE_CALL_RECORDED";
    },
  },
};
