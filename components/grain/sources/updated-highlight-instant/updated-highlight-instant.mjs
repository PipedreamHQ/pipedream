import common from "../common/highlight.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "grain-updated-highlight-instant",
  name: "New Highlight Updated (Instant)",
  description: "Emit new event when a highlight is updated. Each webhook delivery emits an event, including retries. [See the documentation](https://developers.grain.com/#create-hook)",
  version: "1.0.0",
  type: "source",
  // Grain does not document a delivery ID; deduping by resource ID would discard later updates.
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
