import common from "../common/base-webhook.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "rinkel-call-ended",
  name: "Call Ended (Instant)",
  description: "Emit new event when a call ends. [See the documentation](https://developers.rinkel.com/docs/api/subscribe-to-a-webhook)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return "callEnd";
    },
    generateMeta(event) {
      return {
        id: event.id,
        summary: `Call ended: ${event.cause}`,
        ts: Date.parse(event.datetime),
      };
    },
  },
  sampleEmit,
};
