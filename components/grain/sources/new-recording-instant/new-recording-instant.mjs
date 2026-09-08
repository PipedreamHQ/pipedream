import common from "../common/recording.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "grain-new-recording-instant",
  name: "New Recording (Instant)",
  description: "Emit new event when a recording is added. [See the documentation](https://developers.grain.com/#create-hook)",
  version: "1.0.0",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getHookType() {
      return "recording_added";
    },
    getTimestamp({ data }) {
      const ts = Date.parse(data.end_datetime);
      return Number.isNaN(ts)
        ? Date.now()
        : ts;
    },
    getSummary({ data }) {
      return `New recording added: ${data.id}`;
    },
  },
  sampleEmit,
};
