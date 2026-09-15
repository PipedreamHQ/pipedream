import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "grain-new-story-instant",
  name: "New Story (Instant)",
  description: "Emit new event when a story is added. [See the documentation](https://developers.grain.com/#create-hook)",
  version: "1.0.0",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getHookType() {
      return "story_added";
    },
    getTimestamp({ data }) {
      const ts = Date.parse(data.created_datetime);
      return Number.isNaN(ts)
        ? Date.now()
        : ts;
    },
    getSummary({ data }) {
      return `New story added: ${data.id}`;
    },
  },
  sampleEmit,
};
