import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "grain-updated-story-instant",
  name: "New Story Updated (Instant)",
  description: "Emit new event when a story is updated. Deduplicates retried webhook deliveries of the same update; each distinct update still emits. [See the documentation](https://developers.grain.com/#create-hook)",
  version: "1.1.0",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getHookType() {
      return "story_updated";
    },
    getTimestamp({ data }) {
      const ts = Date.parse(data.last_edited_datetime);
      return Number.isNaN(ts)
        ? Date.now()
        : ts;
    },
    getSummary({ data }) {
      return `New story updated: ${data.id}`;
    },
  },
  sampleEmit,
};
