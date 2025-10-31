import common from "../common/webhook.mjs";

export default {
  ...common,
  key: "facebook_pages-new-feed-activity",
  name: "New Feed Activity",
  description: "Emit new event when there's a new activity in your Facebook Page's feed. This includes new posts, comments, reactions, and shares.",
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
        item, verb, post_id, created_time,
      } = data;
      const ts = created_time
        ? created_time * 1000
        : Date.now();
      const id = post_id || `${item}-${verb}-${ts}`;

      let summary = `New ${verb} on ${item}`;
      if (data.from?.name) {
        summary = `${data.from.name} ${verb} ${item}`;
      }
      if (data.message) {
        summary += `: ${data.message.substring(0, 50)}...`;
      }

      return {
        id,
        summary,
        ts,
      };
    },
    processEvent(change) {
      if (change.field === "feed") {
        return change.value;
      }
      return null;
    },
  },
};
