import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "grain-updated-story-instant",
  name: "New Story Updated (Instant)",
  description: "Emit new event when a story is updated. Each webhook delivery emits an event, including retries. [See the documentation](https://developers.grain.com/#create-hook)",
  version: "1.0.1",
  type: "source",
  // Grain does not document a delivery ID; deduping by resource ID would discard later updates.
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
