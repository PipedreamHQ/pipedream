import common from "../common/base.mjs";

export default {
  ...common,
  key: "smartsheet-comment-comment-added",
  name: "New Comment Added (Instant)",
  description: "Emit new event when a comment is added in a sheet.",
  version: "0.0.1",
  type: "action",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getWebhookName() {
      return "Pipedream New Comment Added";
    },
    isRelevant({
      objectType, eventType,
    }) {
      return objectType === "comment" && eventType === "created";
    },
    generateMeta(event) {
      return {
        id: event.id,
        summary: `Comment ${event.id} added`,
        ts: Date.parse(event.timestamp),
      };
    },
  },
};
