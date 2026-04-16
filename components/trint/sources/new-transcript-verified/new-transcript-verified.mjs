import common from "../common/base-webhook.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "trint-new-transcript-verified",
  name: "New Transcript Verified (Instant)",
  description: "Emit new event when a transcript is verified. [See the documentation](https://dev.trint.com/reference/register-webhook-endpoint)",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventTypes() {
      return [
        "TRANSCRIPT_VERIFIED",
      ];
    },
  },
  sampleEmit,
};
