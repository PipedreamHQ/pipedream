import common from "../common/webhook.mjs";

export default {
  ...common,
  key: "facebook_pages-new-comment",
  name: "New Comment on Post",
  description: "Emit new event when a new comment is added to a post on your Facebook Page.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFields() {
      return [
        "feed",
      ];
    },
    generateMeta(data) {
      const {
        comment_id, parent_id, created_time, from, message,
      } = data;
      const ts = created_time
        ? created_time * 1000
        : Date.now();
      const id = comment_id || `comment-${parent_id}-${ts}`;

      let summary = "New comment";
      if (from?.name) {
        summary = `New comment by ${from.name}`;
      }
      if (message) {
        const preview = message.substring(0, 50);
        summary += `: ${preview}${message.length > 50
          ? "..."
          : ""}`;
      }

      return {
        id,
        summary,
        ts,
      };
    },
    processEvent(change) {
      if (change.field === "feed" && change.value) {
        const {
          item, verb,
        } = change.value;
        // Only emit events for new comments
        if (item === "comment" && verb === "add") {
          return change.value;
        }
      }
      return null;
    },
  },
};
