import common from "../common/base.mjs";

export default {
  ...common,
  key: "smartsheet-new-comment-added",
  name: "New Comment Added (Instant)",
  description: "Emit new event when a comment is added in a sheet.",
  version: "0.0.2",
  type: "source",
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
    async getResource(event) {
      return this.smartsheet.getComment(this.sheetId, event.id);
    },
  },
};
