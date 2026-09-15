import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "grain-removed-story-instant",
  name: "New Story Removed (Instant)",
  description: "Emit new event when a story is removed. [See the documentation](https://developers.grain.com/#create-hook)",
  version: "1.0.0",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getHookType() {
      return "story_deleted";
    },
    getSummary({ data }) {
      return `New story removed: ${data.id}`;
    },
  },
  sampleEmit,
};
