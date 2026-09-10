import common from "../common/recording.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "grain-updated-recording-instant",
  name: "New Recording Updated (Instant)",
  description: "Emit new event when a recording is updated. Deduplicates retried webhook deliveries of the same update; each distinct update still emits. [See the documentation](https://developers.grain.com/#create-hook)",
  version: "1.1.0",
  type: "source",
  dedupe: "unique",
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
