import common from "../common/webhook.mjs";

export default {
  ...common,
  key: "facebook_pages-new-post",
  name: "New Post To Page",
  description: "Emit new event when a new post is made to your Facebook Page's feed.",
  version: "0.0.4",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getObject() {
      return "page";
    },
    getFields() {
      return [
        "feed",
      ];
    },
    generateMeta(data) {
      const {
        post_id, created_time, from, message,
      } = data;
      const ts = created_time
        ? created_time * 1000
        : Date.now();
      const id = post_id || `post-${ts}`;

      let summary = "New post";
      if (from?.name) {
        summary = `New post by ${from.name}`;
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
        // Only emit events for new posts
        if (item === "post" && verb === "add") {
          return change.value;
        }
      }
      return null;
    },
  },
};
