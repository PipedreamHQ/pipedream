import common from "../common/highlight.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "grain-new-highlight-instant",
  name: "New Highlight (Instant)",
  description: "Emit new event when a highlight is added. [See the documentation](https://developers.grain.com/#create-hook)",
  version: "1.0.0",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getHookType() {
      return "highlight_added";
    },
    getTimestamp({ data }) {
      const ts = Date.parse(data.created_datetime);
      return Number.isNaN(ts)
        ? Date.now()
        : ts;
    },
    getSummary({ data }) {
      return `New highlight added: ${data.id}`;
    },
  },
  sampleEmit,
};
