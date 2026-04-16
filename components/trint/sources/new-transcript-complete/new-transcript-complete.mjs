import common from "../common/base-webhook.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "trint-new-transcript-complete",
  name: "New Transcript Complete (Instant)",
  description: "Emit new event when a transcript is complete. [See the documentation](https://dev.trint.com/reference/register-webhook-endpoint)",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventTypes() {
      return [
        "TRANSCRIPT_COMPLETE",
      ];
    },
  },
  sampleEmit,
};
