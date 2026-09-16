import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "grain-removed-highlight-instant",
  name: "New Highlight Removed (Instant)",
  description: "Emit new event when a highlight is removed. [See the documentation](https://developers.grain.com/#create-hook)",
  version: "1.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getHookType() {
      return "highlight_deleted";
    },
    getSummary({ data }) {
      return `Highlight removed: ${data.id}`;
    },
  },
  sampleEmit,
};
