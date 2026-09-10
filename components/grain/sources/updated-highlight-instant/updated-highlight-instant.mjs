import common from "../common/highlight.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "grain-updated-highlight-instant",
  name: "New Highlight Updated (Instant)",
  description: "Emit new event when a highlight is updated. Deduplicates retried webhook deliveries of the same update; each distinct update still emits. [See the documentation](https://developers.grain.com/#create-hook)",
  version: "1.1.0",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getHookType() {
      return "highlight_updated";
    },
    getSummary({ data }) {
      return `New highlight updated: ${data.id}`;
    },
  },
  sampleEmit,
};
