import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "seven-new-incoming-call-instant",
  name: "New Incoming Call (Instant)",
  description: "Emit new event when a voice call occurs. [See the documentation](https://docs.seven.io/en/rest-api/endpoints/webhooks#register-webhook)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return "voice_call";
    },
    getSummary(details) {
      return `New incoming call: ${details.data.caller}`;
    },
  },
  sampleEmit,
};
