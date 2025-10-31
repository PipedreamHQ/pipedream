import common from "../common/webhook.mjs";

export default {
  ...common,
  key: "facebook_pages-new-reaction",
  name: "New Reaction on Post",
  description: "Emit new event when someone reacts to a post on your Facebook Page (likes, love, wow, etc.).",
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
        post_id, reaction_type, from, created_time,
      } = data;
      const ts = created_time
        ? created_time * 1000
        : Date.now();
      const id = `reaction-${post_id}-${from?.id || "unknown"}-${ts}`;

      let summary = "New reaction";
      if (reaction_type) {
        summary = `New ${reaction_type} reaction`;
      }
      if (from?.name) {
        summary += ` from ${from.name}`;
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
        // Only emit events for reactions
        if (item === "reaction" && verb === "add") {
          return change.value;
        }
      }
      return null;
    },
  },
};
