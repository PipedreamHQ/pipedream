import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "dropmark-new-activity",
  name: "New Activity",
  description: "Emit new event when a new collection, item, comment, or reaction occurs. [See the documentation](https://support.dropmark.com/article/96-api)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.dropmark.getActivityFeed;
    },
    generateMeta(item) {
      return {
        id: item.id,
        summary: `New ${item.type}: ${item.name}`,
        ts: Date.parse(item.created_at),
      };
    },
  },
  sampleEmit,
};
