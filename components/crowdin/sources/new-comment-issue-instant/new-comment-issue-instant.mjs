import common from "../common/base-instant.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "crowdin-new-comment-issue-instant",
  name: "New Comment or Issue Added (Instant)",
  description: "Emit new event when a user adds a comment or an issue in Crowdin.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "stringComment.created",
      ];
    },
    getSummary(body) {
      return `New comment or issue in project: ${body.comment.string.project.id}`;
    },
  },
  sampleEmit,
};
