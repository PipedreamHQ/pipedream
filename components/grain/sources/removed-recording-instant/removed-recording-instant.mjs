import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "grain-removed-recording-instant",
  name: "New Recording Removed (Instant)",
  description: "Emit new event when a recording is removed. [See the documentation](https://developers.grain.com/#create-hook)",
  version: "1.0.0",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getHookType() {
      return "recording_deleted";
    },
    getSummary({ data }) {
      return `Recording removed: ${data.id}`;
    },
  },
  sampleEmit,
};
