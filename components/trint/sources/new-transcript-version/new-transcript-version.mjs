import common from "../common/base-webhook.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "trint-new-transcript-version",
  name: "New Transcript Version (Instant)",
  description: "Emit new event when a new transcript version is created. [See the documentation](https://dev.trint.com/reference/register-webhook-endpoint)",
  type: "source",
  version: "0.0.1",
  methods: {
    ...common.methods,
    getEventTypes() {
      return [
        "TRANSCRIPT_NEW_VERSION",
      ];
    },
  },
  sampleEmit,
};
