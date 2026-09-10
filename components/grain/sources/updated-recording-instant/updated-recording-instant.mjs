import common from "../common/recording.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "grain-updated-recording-instant",
  name: "New Recording Updated (Instant)",
  description: "Emit new event when a recording is updated. Each webhook delivery emits an event, including retries. [See the documentation](https://developers.grain.com/#create-hook)",
  version: "1.0.1",
  type: "source",
  // Grain does not document a delivery ID; deduping by resource ID would discard later updates.
  methods: {
    ...common.methods,
    getHookType() {
      return "recording_updated";
    },
    getSummary({ data }) {
      return `New recording updated: ${data.id}`;
    },
  },
  sampleEmit,
};
