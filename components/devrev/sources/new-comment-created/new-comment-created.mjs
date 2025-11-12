import common from "../common/common.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "devrev-new-comment-created",
  name: "New Comment Created (Instant)",
  description: "Emit new event when a new comment is created in DevRev.",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventTypes() {
      return [
        "timeline_entry_created",
      ];
    },
    getItem(body) {
      return body.timeline_entry_created.entry;
    },
    generateMeta(comment) {
      return {
        id: comment.id,
        summary: comment.body,
        ts: Date.parse(comment.created_date),
      };
    },
    isRelevant(item) {
      return item?.body;
    },
  },
  sampleEmit,
};
